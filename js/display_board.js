const color_gradient = [
    "EE0000", "EA4D00", "E79900", "E4E200",
    "99E100", "4DDE00", "04DB00", "00D843",
    "00D488", "00D1CB", "0090CE", "004ACB",
    "0007C8", "3900C5", "7800C2", "B500BF"
];

var dictionary_root = {};

function mod(n, m) { return ((n % m) + m) % m; }

var app = new Vue({
    el: "#app",
    data: {
        letters: "",
        found_words: {},
        found_words_list: [],
        selected_word: "",
        input_focused: false,
        iteration_terminator: null
    },
    methods: {
        is_valid_board: function is_valid_board() {
            if (this.letters)
                return this.letters.length === 16;
        },
        find_words: function find_words() {
            if (this.is_valid_board())
                this.found_words = traverse_board(this.letters, dictionary_root);
        },
        is_valid_word: function is_valid_word() {
            if (this.is_valid_board() && this.selected_word)
                return this.found_words[this.selected_word.toUpperCase()];
        },
        is_selected_tile: function is_selected_tile(idx) {
            if (!this.is_valid_board())
                return '';
            return (this.found_words[this.selected_word.toUpperCase()] || []).indexOf(idx) === -1 ? '' : "selected";
        },
        selected_tile_color: function selected_tile_color(idx) {
            if (!this.is_valid_board())
                return "";
            return "idx" + (this.found_words[this.selected_word.toUpperCase()] || []).indexOf(idx);
        },
        next_letter_direction: function function_name(idx) {
            const word_chain = this.found_words[this.selected_word.toUpperCase()] || []
            const index_in_word = word_chain.indexOf(idx)
            if (!this.is_valid_board() || index_in_word === word_chain.length - 1)
                return "end";

            const next_idx = word_chain[index_in_word + 1];

            current_row = parseInt(idx / 4);
            current_column = idx % 4;

            next_row = parseInt(next_idx / 4);
            next_column = next_idx % 4;


            row_diff = next_row - current_row;
            column_diff = next_column - current_column;

            var arrow_class = [];
            if (row_diff === -1)
                arrow_class.push("top");
            else if (row_diff === 1)
                arrow_class.push("bottom");

            if (column_diff === -1)
                arrow_class.push("left");
            else if (column_diff === 1)
                arrow_class.push("right");

            return arrow_class.join("-");
        },
        select_word: function select_word(word) {
            this.stop_iterating();
            if (this.is_valid_board())
                this.selected_word = word;
        },
        focus: function focus() {
            this.input_focused = true;
        },
        blur: function blur() {
            this.input_focused = false;
        },
        last_word: function last_word() {
            var word_index = this.found_words_list.indexOf(this.selected_word);
            if (!this.selected_word)
                word_index = 0;
            this.selected_word = this.found_words_list[mod((word_index - 1), (this.found_words_list.length - 1))];
        },
        next_word: function next_word() {
            var word_index = this.found_words_list.indexOf(this.selected_word);
            this.selected_word = this.found_words_list[mod((word_index + 1), (this.found_words_list.length - 1))];
        },
        iterate_word: function iterate_word() {
            var iteration_ms = this.selected_word.length / 2;
            this.next_word();
            this.iteration_terminator = setTimeout(this.iterate_word, iteration_ms * 1000);
        },
        stop_iterating: function stop_iterating() {
            if (this.iteration_terminator) {
                clearTimeout(this.iteration_terminator);
                this.iteration_terminator = null;
            }
        },
        start_iterating: function start_iterating() {
            this.stop_iterating();
            this.iterate_word();
        },
        toggle_iterating: function toggle_iterating() {
            if (this.iteration_terminator) {
                this.stop_iterating();
            } else {
                this.start_iterating();
            }
        }
    },
    watch: {
        letters: function letters_watch() {
            this.stop_iterating();
            this.letters = this.letters.replace(/[\W\d]/ig, "").toUpperCase();
            if (this.is_valid_board()) {
                this.find_words();
                this.found_words_list = Object.getOwnPropertyNames(this.found_words);
                this.found_words_list.splice(this.found_words_list.indexOf("__ob__"), 1);
                // setTimeout(this.start_iterating, 3000);
            } else { this.stop_iterating(); }
        },
        selected_word: function selected_word_watch(){
            this.selected_word = this.selected_word.replace(/[\W\d]/ig, "").toUpperCase();
        }
    },
    computed: {
        words_by_length: function words_by_length() {
            if (!this.found_words)
                return {};
            const words = Object.getOwnPropertyNames(this.found_words);
            var words_by_length = {}
            for (var word of words) {
                if ("__ob__" === word)
                    continue;
                // qu_shortened = word.replace("QU", "Q").length
                words_by_length[word.length] = words_by_length[word.length] || [];
                words_by_length[word.length].push(word);
            }
            return Object.getOwnPropertyNames(words_by_length)
                .map(length => ({ "length": length, "words": words_by_length[length] }))
                .reverse();
        },
        missing_letters: function missing_letters(){
            return new Array(16 - this.letters.length);
        }
    },
    mounted: function mounted() {
        window.addEventListener("keypress", function(e) {
            if (this.input_focused)
                return;

            var key = String.fromCharCode(e.keyCode)
            console.log(key);

            switch (key) {
                case 'j':
                    this.last_word();
                    break;
                case 'k':
                    this.toggle_iterating();
                case 'l':
                    this.next_word();
                    break;
            }

        }.bind(this));
    }
});