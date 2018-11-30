import translator as t
import unittest


class KnownValues(unittest.TestCase):
    known_values = (
        ('$-1/3(60)^0.5 - 4(50)^0.5$', '$\dfrac{-1}{3}\sqrt{60} - 4\sqrt{50}$'),
        ('$5/12 + 3(-1)^0.5$', '$\dfrac{5}{12} + 3\sqrt{-1}$'),
        ('25*3', '25\cdot3')
    )

    def test_to_syntex_known_values(self):
        '''Should give known result with known input'''
        for syntex, latex in self.known_values:
            result = t.translator(latex, 'to_syntex')
            self.assertEqual(syntex, result)

    def test_to_latex_known_values(self):
        '''Should give known result with known input'''
        for syntex, latex in self.known_values:
            result = t.translator(syntex, 'to_latex')
            self.assertEqual(latex, result)


if __name__ == '__main__':
    unittest.main()
