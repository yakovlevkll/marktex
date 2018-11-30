function antiQuoter(string) {
    return string.substring(1, string.length - 1);
}

function replaceStuff() {
    var re = /([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)/;
    var str = "Джон Смит";
    var newstr = str.replace(re, "$2, $1");
    console.log(newstr); // Смит, Джон
}

function toOldLatex(string) {
    changes = [
        //Symbols
        { mt: /\*/g, latex: " \\cdot " },
        { mt: /\\deg/g, latex: "^\\circ " }, // alternative is °
        { mt: /\.\.\./g, latex: "\\ldots " },

        { mt: />=/g, latex: "\\geqslant " },
        { mt: /<=/g, latex: "\\leqslant " },
        { mt: /=\/=|=\\=/g, latex: "\\neq " },
        { mt: /\+-/g, latex: "\\pm " },
        { mt: /-\+/g, latex: "\\mp " },

        //Brackets
        { mt: /\(/g, latex: "\\left( " },
        { mt: /\)/g, latex: "\\right)" },

        //Arrows
        { mt: /<->/g, latex: "\\longleftrightarrow" },
        { mt: /->/g, latex: "\\rightarrow " },

        //Fraction
        { mt: /\\df/g, latex: "\\dfrac" },
        { mt: /\\fr/g, latex: "\\frac" },
        { mt: /([\d\w^]+)\/([\d\w^]+)/g, latex: "\\dfrac{$1}{$2}" },
        { mt: /{([^{]*)}\/{([^}]*)}/g, latex: "\\dfrac{$1}{$2}" },
        { mt: /([\d\w^]+)\/{([^}]*)}/g, latex: "\\dfrac{$1}{$2}" },
        { mt: /{([^{]*)}\/([\d\w^]+)/g, latex: "\\dfrac{$1}{$2}" },

        //Greek alphabet
        { mt: /\\ga/g, latex: "\\alpha " },
        { mt: /\\gb/g, latex: "\\beta " },
        { mt: /\\gg/g, latex: "\\gamma " },

        //Other
        { mt: /\\lt/g, latex: "\\left " },
        { mt: /\\rt/g, latex: "\\right " }
    ];

    for (var change of changes) {
        check = string.match(change.mt);
        if (check != -1) {
            string = string.replace(change.mt, change.latex);
        }
    }

    //Long numbers

    return string;
}

var main = new Vue({
    el: "main",
    data: {
        source: ""
    },
    computed: {
        paper: {
            get: function() {
                lines = this.source.split("\n");

                codeBlock = 0;
                table = false;
                ol = false;
                ul = false;

                for (let i = 0; i < lines.length; i++) {
                    //Empty line
                    if (lines[i].length == 0) {
                        lines[i] = "";
                        if (table) {
                            table = !table;
                            lines[i] += "</table>";
                        }
                        if (ol) {
                            ol = !ol;
                            lines[i] += "</ol>";
                        }
                        if (ul) {
                            ul = !ul;
                            lines[i] += "</ul>";
                        }
                        continue;
                    }

                    //Math syntax
                    mathCheck = lines[i].search(/\$/g);

                    if (mathCheck != -1) {
                        var maths = lines[i].match(/\$([^\$]+?)\$/g);
                        for (var j = 0; j < maths.length; j++) {
                            lines[i] = lines[i].replace(
                                maths[j],
                                toOldLatex(maths[j])
                            );
                        }
                    }

                    //Code blocks
                    codeCheck = lines[i].indexOf("```");
                    if (codeCheck == 0) {
                        if (lines[i].length > 3) {
                            lines[i] = `<pre><code class="${lines[i].substring(
                                3,
                                lines[i].length
                            )}">`;
                            codeBlock++;
                        } else {
                            lines[i] = "</code></pre>";
                            codeBlock--;
                        }
                        continue;
                    }

                    //Table headers
                    if (lines[i] === "@table") {
                        lines[i] = "<table>";
                        table = !table;
                        continue;
                    }

                    //Table contents
                    if (table) {
                        var cells = lines[i].split("|");
                        var row = "";
                        for (var cell of cells) {
                            row += `<td>${cell}</td>`;
                        }
                        lines[i] = `<tr>${row}</tr>`;
                        continue;
                    }

                    //List headers
                    if (lines[i] === "@ol") {
                        lines[i] = "<ol>";
                        ol = !ol;
                        continue;
                    }
                    if (lines[i] === "@ul") {
                        lines[i] = "<ul>";
                        ul = !ul;
                        continue;
                    }

                    //List contents
                    if (ol || ul) {
                        lines[i] = `<li>${lines[i]}</li>`;
                        continue;
                    }

                    //Headers
                    headerCheck = lines[i].search(/[#!]/);
                    if (headerCheck == 0) {
                        var headerLevel = lines[i].match(/^([#!]+)/)[0].length;
                        lines[i] = `<h${headerLevel}>${lines[i].substring(
                            headerLevel,
                            lines[i].length
                        )}</h${headerLevel}>`;
                        continue;
                    }

                    //Bold text
                    boldCheck = lines[i].search(/\*(.*?)\*/g);

                    if (boldCheck != -1) {
                        var bolds = lines[i].match(/\*(.*?)\*/g);
                        for (var j = 0; j < bolds.length; j++) {
                            lines[i] = lines[i].replace(
                                bolds[j],
                                `<b>${antiQuoter(bolds[j])}</b>`
                            );
                        }
                    }

                    //Italic text
                    italicCheck = lines[i].search(/_(.*)_/g);

                    if (italicCheck != -1) {
                        var italics = lines[i].match(/_(.*?)_/g);
                        for (var j = 0; j < italics.length; j++) {
                            lines[i] = lines[i].replace(
                                italics[j],
                                `<i>${antiQuoter(italics[j])}</i>`
                            );
                        }
                    }

                    //Paragraphs
                    if (codeBlock == 0) {
                        lines[i] = `<p>${lines[i]}</p>`;
                    } else {
                        lines[i] = lines[i] + "<br>";
                    }
                }

                return lines.join("");
            }
        },
        set: function() {}
    },
    methods: {
        rerender: function() {
            hljs.initHighlighting.called = false;
            hljs.initHighlighting();
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "result"]);
        }
    }
});
