import os
from google.cloud import vision
import openai

current_dir = os.path.dirname(os.path.abspath(__file__))
credentials_path = os.path.join(current_dir, '..', '..', 'google-credentials.json')
# Initialize Google Vision client
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
vision_client = vision.ImageAnnotatorClient()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

class ImageSummaryService:
    @staticmethod
    def get_image_labels(image_path):
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        response = vision_client.label_detection(image=image)
        labels = response.label_annotations
        return [label.description for label in labels]

    @staticmethod
    def generate_summary(labels):
        prompt = f"Provide a brief summary about the following objects or landmarks: {', '.join(labels)}"
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150
        )
        return response.choices[0].text.strip()

    @staticmethod
    def get_image_summary(image_path):
        labels = ImageSummaryService.get_image_labels(image_path)
        summary = ImageSummaryService.generate_summary(labels)
        return summary