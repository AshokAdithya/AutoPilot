from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import yt_dlp
import smtplib
import os
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import ffmpeg

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmailRequest(BaseModel):
    email: str
    name: str
    department: str
    year: str
    startDate: str
    endDate: str
    leaveDays: str

class VideoRequest(BaseModel):
    url: str
    quality: str
    type: str

def send_email(sender_email, subject, body, recipient_email):
    try:
        sender_password ="bwqglyecktznxawg"
        
        if not sender_password:
            raise HTTPException(status_code=400, detail="Email password not found")
        
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, f"Subject: {subject}\n\n{body}")
            server.close()

        return "Email sent successfully!"
    except Exception as e:
        raise HTTPException(status_code=400, detail="Email is not sent")

@app.get("/")
async def welcome_abord():
    return "Welcome, abord"

@app.post("/email/send-email")
async def get_email_details(email_request: EmailRequest):
    try:
        sender_email = email_request.email
        name = email_request.name
        department = email_request.department
        year = email_request.year
        start_date = email_request.startDate
        end_date = email_request.endDate
        leave_days = email_request.leaveDays

        if '' in [sender_email, name, department, year, start_date, end_date, leave_days]:
            raise HTTPException(status_code=400, detail="Need Full details")

        subject = "Request For leave"
        body = f"""
Name: {name}
Department: {department}
Year: {year}
Leave Dates: {start_date} - {end_date}
Total Leave Days: {leave_days}
"""

        recipient_email = "leaverequestpremiummess@gmail.com"
      

        status = send_email(sender_email, subject, body, recipient_email)
        return {"message": status}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def convert_m3u8_to_mp4(m3u8_url, output_file):
    try:
        ffmpeg.input(m3u8_url).output(output_file, c='copy', bsfa='aac_adtstoasc').run()
        print(f"Conversion successful! File saved as {output_file}")
    except ffmpeg.Error as e:
        print("An error occurred during conversion:", e.stderr.decode())

def get_low_download_url(url, type_video):
    try:
        opts_options = {
            'format': 'best',
            'noplaylist': True,
            'quiet': True,
            'throttlerate': '50K',  
            'sleep_interval': 2,
            
        }

        if type_video == "playlist":
            opts_options['noplaylist'] = False

        with yt_dlp.YoutubeDL(opts_options) as ydl_video:
            video_info = ydl_video.extract_info(url, download=False)

        if not video_info:
            raise HTTPException(status_code=400, detail="Video not found")

        video_url = None
        subtitle_url = None
        title_url = None

        if type_video == "single":
            video_download_url = video_info.get("url")
            subtitle_url = None
            if 'automatic_captions' in video_info:
                captions = video_info['automatic_captions'].get('en', [])
                for caption in captions:
                    if caption['ext'] == 'vtt':
                        subtitle_url = caption['url']

            return {"title_url": video_info.get("title"),
                    "video_url": video_download_url,
                    "audio_url": None,
                    "subtitle_url": subtitle_url}
        else:
            video_url = []
            subtitle_url = []
            title_url = []

            if "entries" in video_info:
                for entry in video_info["entries"]:
                    title_url.append(entry["title"])
                    video_url.append(entry["url"])

                    captions = entry.get('automatic_captions', {}).get('en-orig', [])
                    subtitle = None
                    for caption in captions:
                        if caption["ext"] == "vtt":
                            subtitle = caption["url"]
                    subtitle_url.append(subtitle)     

            return {"title_url": title_url, "video_url": video_url, "audio_url": None, "subtitle_url": subtitle_url}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def get_download_url(url, type_video):
    try:
        video_opts = {
            'format': 'bestvideo/best',
            'noplaylist': True,
            'quiet': True,
            'subtitleslangs': ['en'],
            'writesubtitles': True,
            'allsubtitles': True,
            'throttlerate': '50K',
            'sleep_interval': 2,
        }

        audio_opts = {
            'format': 'bestaudio/best',
            'noplaylist': True,
            'quiet': True
        }

        if type_video == "playlist":
            video_opts['noplaylist'] = False
            audio_opts['noplaylist'] = False

        with yt_dlp.YoutubeDL(video_opts) as ydl_video:
            video_info = ydl_video.extract_info(url, download=False)

        with yt_dlp.YoutubeDL(audio_opts) as ydl_audio:
            audio_info = ydl_audio.extract_info(url, download=False)

        if not video_info:
            raise HTTPException(status_code=400, detail="Video not found")

        video_url = None
        audio_url = None
        subtitle_url = None
        title_url = None

        if type_video == "single":
            video_download_url=video_info.get('url')
            if(video_download_url.endswith(".m3u8")):
                video_download_url=convert_m3u8_to_mp4(video_download_url,"video.mp4")
            subtitle = None
            captions = video_info.get('automatic_captions', {}).get('en-orig', [])

            for caption in captions:
                if caption["ext"] == "vtt":
                    subtitle = caption["url"]

            return {"title_url": video_info.get("title"),
                    "video_url": video_download_url,
                    "audio_url": audio_info.get("url"),
                    "subtitle_url": subtitle}
        else:
            title_url = []
            video_url = []
            audio_url = []
            subtitle_url = []

            for i in range(len(video_info["entries"])):
                title_url.append(video_info["entries"][i]["title"])
                video_url.append(video_info["entries"][i]["url"])
                audio_url.append(audio_info["entries"][i]["url"])

                captions = video_info["entries"][i].get('automatic_captions', {}).get('en-orig', [])
                subtitle = None
                for caption in captions:
                    if caption["ext"] == "vtt":
                        subtitle = caption["url"]
                subtitle_url.append(subtitle)

            return {"title_url": title_url,
                    "video_url": video_url,
                    "audio_url": audio_url,
                    "subtitle_url": subtitle_url}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post('/youtube/downloadVideo')
async def download_url(video_request: VideoRequest):
    video_url = video_request.url
    quality = video_request.quality
    type_video = video_request.type

    if not video_url:
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        result = None
        if quality == "high":
            result = get_download_url(video_url, type_video)
        else:
            result = get_low_download_url(video_url, type_video)

        if result:
            return result
        else:
            raise HTTPException(status_code=400, detail="Failed to fetch download url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

                
if  __name__=="__main__":
    uvicorn.run("app:app",host="0.0.0.0",port=8000)