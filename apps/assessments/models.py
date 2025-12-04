from apps.candidates import models


class Assessment(models.Model):
    candidate = models.ForeignKey('candidates.Candidate', on_delete=models.CASCADE)
    test_name = models.CharField(max_length=100)
    score = models.FloatField()
    completed_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.candidate} - {self.test_name} : {self.score}"