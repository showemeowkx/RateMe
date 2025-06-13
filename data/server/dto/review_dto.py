from pydantic import BaseModel

class ReviewDto(BaseModel):
    experience: str
    liked: str
    disliked: str
    comment: str