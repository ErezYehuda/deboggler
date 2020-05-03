const tile_neighborhood = [
    [1, 4, 5],
    [0, 2, 4, 5, 6],
    [1, 3, 5, 6, 7],
    [2, 6, 7],
    [5, 0, 1, 8, 9],
    [4, 6, 0, 1, 2, 8, 9, 10],
    [5, 7, 1, 2, 3, 9, 10, 11],
    [6, 2, 3, 10, 11],
    [9, 4, 5, 12, 13],
    [8, 10, 4, 5, 6, 12, 13, 14],
    [9, 11, 5, 6, 7, 13, 14, 15],
    [10, 6, 7, 14, 15],
    [13, 8, 9],
    [12, 14, 8, 9, 10],
    [13, 15, 9, 10, 11],
    [14, 10, 11]
];

function build_dictionary_tree(words){
    var dictionary_root = {};

    for (let word of words){
        if(word.length < 3)
            continue;

        current = dictionary_root;

        for (var letter_idx=0; letter_idx< word.length; letter_idx++){
            letter = word[letter_idx];

            if("q" == letter
                && letter_idx + 1 < word.length
                && "u" == word[letter_idx + 1]
            ){
            letter = "qu";
            letter_idx+=1;
            }

        if (!current[letter])
            current[letter] = {};
        current = current[letter];

        }
        current["word"] = true;
    }

    return dictionary_root;
}

function dictionary_has_word(tree_root, word){
    var letter_idx = 0;
    var dictionary = tree_root;
    while (letter_idx < word.length){
        let letter = word[letter_idx];
        if (
            "q" === letter
              && letter_idx + 1 < word.length
              && "u"  === word[letter_idx+1]
            ){
            letter = "qu";
            letter_idx += 1;
        }

        if (!dictionary[letter])
            return false;
        dictionary = dictionary[letter];
        letter_idx += 1;
    }

    return true;
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

function traverse_board(letter_board, dictionary){
    found_words={};

    var traverse_board_from_index = function traverse_board_from_index(idx, last_letter, encountered_tiles, tile_chain){
        letter = letter_board[idx].toLowerCase();
            if ("q" === letter)
                letter = "qu";

            var current_letter;
            if (last_letter[letter]){
                current_letter = last_letter[letter];
                tile_chain.push(idx);
                encountered_tiles = union(encountered_tiles, new Set([idx]));
                if (current_letter["word"]){
                    var word = tile_chain.map(tile_idx=>letter_board[tile_idx]).join('').replace("Q", "QU");
                    found_words[word] = found_words[word] || tile_chain.slice();
                }

                for(let neighbor of tile_neighborhood[idx]){
                    if(!encountered_tiles.has(neighbor))
                        traverse_board_from_index(neighbor, current_letter, encountered_tiles, tile_chain);
                }

                tile_chain.pop();
            };
    };

    for (var idx=0; idx< 16; idx++)
        traverse_board_from_index(idx, dictionary, new Set(), []);

    return found_words;
}

