export class FormResponse {
  constructor({ recommendation, summary, score }) {
    this.recommendation = recommendation;
    this.summary = summary;
    this.score = score;
  }

  static fromJson(json) {
    return new FormResponse({
      recommendation: json.recommendation || "No recommendation",
      summary: json.summary || "No summary available",
      score: json.score || 0
    });
  }
}
