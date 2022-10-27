"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_vocabulary_files = exports.VocabGeneration = void 0;
const convert_1 = require("./lib/convert");
const turtle_1 = require("./lib/turtle");
const jsonld_1 = require("./lib/jsonld");
const html_1 = require("./lib/html");
const fs_1 = require("fs");
/**
 * Conversion class for YAML to the various syntaxes.
 */
class VocabGeneration {
    vocab;
    /**
     *
     * @param yml_content - the YAML content in string (before parsing)
     */
    constructor(yml_content) {
        this.vocab = (0, convert_1.get_data)(yml_content);
    }
    /**
     * Get the Turtle representation of the vocabulary
     *
     * @returns The Turtle content
     */
    get_turtle() {
        return (0, turtle_1.to_turtle)(this.vocab);
    }
    /**
     * Get the JSON-LD representation of the vocabulary
     *
     * @returns The JSON-LD content
     */
    get_jsonld() {
        return (0, jsonld_1.to_jsonld)(this.vocab);
    }
    /**
     * Get the HTML/RDFa representation of the vocabulary based on an HTML template
     * @param template - Textual version of the vocabulary template
     * @returns
     */
    get_html(template) {
        return (0, html_1.to_html)(this.vocab, template);
    }
}
exports.VocabGeneration = VocabGeneration;
/**
 * The most common usage, currently, of the library: convert a YAML file into Turtle, JSON-LD, and HTML,
 * using a common basename for all three files, derived from the YAML file itself. The resulting vocabulary
 * files are stored on the local file system.
 *
 * @param yaml_file_name - the vocabulary file in YAML
 * @param template_file_name - the HTML template file
 */
async function generate_vocabulary_files(yaml_file_name, template_file_name) {
    // This trick allows the user to give the full yaml file name, or only the common base
    const basename = yaml_file_name.endsWith('.yml') ? yaml_file_name.slice(0, -4) : yaml_file_name;
    // Get the two files from the file system (at some point, this can be extended
    // to URL-s using fetch)
    const [yaml, template] = await Promise.all([
        fs_1.promises.readFile(`${basename}.yml`, 'utf-8'),
        fs_1.promises.readFile(template_file_name, 'utf-8')
    ]);
    const conversion = new VocabGeneration(yaml);
    await Promise.all([
        fs_1.promises.writeFile(`${basename}.ttl`, conversion.get_turtle()),
        fs_1.promises.writeFile(`${basename}.jsonld`, conversion.get_jsonld()),
        fs_1.promises.writeFile(`${basename}.html`, conversion.get_html(template)),
    ]);
}
exports.generate_vocabulary_files = generate_vocabulary_files;
