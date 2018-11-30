import translator as t


def translate(input_file, output_file, mode):
    result = ''
    with open(input_file, mode='r', encoding='utf-8') as old:
        for line in old:
            result += t.translator(line, mode)

    with open(output_file, mode='w', encoding='utf-8') as new:
        new.write(result)


def compare(reference_file, new_file):
    result = ''
    reference_list = []
    with open(reference_file, mode='r', encoding='utf-8') as reference:
        for line in reference:
            reference_list.append(line)

    new_list = []
    with open(new_file, mode='r', encoding='utf-8') as new:
        for line in new:
            new_list.append(line)

    for i, item in enumerate(reference_list):
        if reference_list[i] == new_list[i]:
            continue
        else:
            result += 'Error, line {0}. "{1}" must be "{2}"\n'.format(i, new_list[i], reference_list[i])

    if result == '':
        result = 'Files are identical.'

    return result


translate('tex/latex-reference.tex', 'tex/syntex.tex', 'to_syntex')
translate('tex/syntex.tex', 'tex/latex-translated.tex', 'to_latex')
final_test = compare('tex/latex-reference.tex', 'tex/latex-translated.tex')

print(final_test)
