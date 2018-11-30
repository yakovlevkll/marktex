import re

math = r'[-\(\)\^\d\.]+'

dictionary = {
    'to_latex': (
        # (r'(\\\/([^\s\$\n]+))', '\sqrt{{{r[1]}}}'),
        (r'(\(({0})\)\^0\.5)'.format(math), '\sqrt{{{r[1]}}}'),
        (r'((\(?[^\s]\))\/(\(?[^\s]\)))'.format(math), '\dfrac{{{r[1]}}}{{{r[2]}}}'),
        (r'(\*)', '\cdot')
    ),
    'to_syntex': (
        (r'(\\sqrt{(' + math + ')})', '({r[1]})^0.5'),
        (r'(\\dfrac{(' + math + ')}{(' + math + ')})', '{r[1]}/{r[2]}'),
        (r'(\\cdot)', '*')
    )
}


def translator(string, mode):
    changes = dictionary[mode]
    for change in changes:
        matches = re.findall(change[0], string)
        for match in matches:
            # string = re.sub(match[0], change[1].format(r=match), string)

            if isinstance(match, str):
                string = string.replace(match, change[1])
            else:
                string = string.replace(match[0], change[1].format(r=match))
            print(string)

    return string


# print(translator('(50)^0.5/3', 'to_latex'))
