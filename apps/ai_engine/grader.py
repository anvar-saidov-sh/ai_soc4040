from fuzzywuzzy import fuzz

class Grader:
    @staticmethod
    def score(reference, generated):
        """
        Returns a percentage similarity score between 0-100
        """
        return fuzz.ratio(reference.lower(), generated.lower())
