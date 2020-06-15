var dictionary_root = {};

fetch("js/scrabble_dictionary_compressed.txt")
    .then(response => response.text())
    .then(decompressed_text => {
        var dictionary = JSON.parse(LZString.decompressFromUTF16(decompressed_text))
        dictionary_root = build_dictionary_tree(dictionary);

        app.letters = (
            "AHEL" +
            "BDSM" +
            "DETE" +
            "QEEN"
        );
    });