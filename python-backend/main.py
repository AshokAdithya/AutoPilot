from flask import Flask, request, jsonify
import yt_dlp
import smtplib
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

def send_email(sender_email, subject, body, recipient_email):
    try:
        sender_password = os.getenv("password")
        
        if not sender_password:
            return "Email is Not Sent", 400

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, f"Subject: {subject}\n\n{body}")
            server.close()
        
        return "Email sent successfully!", 200
    except Exception as e:
        return "Email is Not Sent", 400
    
@app.route("/email/send-email",methods=["POST"])
def get_email_details():
    try:
        data=request.get_json()
        print(data)
        sender_email = data.get("email")  
        name = data.get("name")
        department = data.get("department")
        year = data.get("year")
        start_date = data.get("startDate")
        end_date = data.get("endDate")
        leave_days = data.get("leaveDays")

        if(sender_email=='' or name=='' or department=='' or year=='' or start_date=='' or end_date=='' or leave_days==''):
            return jsonify({"message":"Need Full details"}),400

        subject = "Request For leave"
        body = f"""
Name: {name}
Department: {department}
Year: {year}
Leave Dates: {start_date} - {end_date}
Total Leave Days: {leave_days}
"""

        recipient_email = "leaverequestpremiummess@gmail.com"

        status, code = send_email(sender_email, subject, body, recipient_email)
        return jsonify({"message": status}), code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_low_download_url(url,type_video):
    try:
        opts_options = {
            'format': 'best',
            'noplaylist':True,
            'quiet':True
        }
    
        if(type_video=="playlist"):
            opts_options['noplaylist']=False

        with yt_dlp.YoutubeDL(opts_options) as ydl_video:
            video_info = ydl_video.extract_info(url, download=False)

        if video_info==[] or video_info=={}:
            return jsonify({"message":"Video not found"}),400
        
        video_url = None
        audio_url = None
        subtitle_url = None
        title_url=None

        if type_video == "single":
            video_download_url = video_info.get("url")
            
            # Get subtitles URL (if available)
            subtitle_url = None
            if 'automatic_captions' in video_info:
                captions = video_info['automatic_captions'].get('en', [])
                for caption in captions:
                    if caption['ext'] == 'vtt':
                        subtitle_url = caption['url']

            return jsonify({
                "title_url":video_info.get("title"),
                "video_url": video_download_url,
                "audio_url": None,  
                "subtitle_url": subtitle_url
            })


        else:
            video_url = []
            subtitle_url = []
            title_url=[]

            if "entries" in video_info:
                for i in range(len(video_info["entries"])):
                    title_url.append(video_info["entries"][i]["title"])
                    video_url.append(video_info["entries"][i]["url"])

                    captions=video_info["entries"][i].get('automatic_captions', {}).get('en-orig', [])
                    subtitle=None
                    for caption in captions:
                        if(caption["ext"]=="vtt"):
                            subtitle=caption["url"]
                    subtitle_url.append(subtitle)

            return jsonify({
                "title_url":title_url,
                "video_url": video_url,
                "audio_url": None,  
                "subtitle_url": subtitle_url
            })
    
    except Exception as e:
        return str(e)

def get_download_url(url,type_video):
    try:
        video_opts = {
            'format': 'bestvideo/best',
            'noplaylist':True,
            'quiet':True,
            'subtitleslangs': ['en'],  
            'writesubtitles': True, 
            'allsubtitles': True,
        }

        audio_opts={
            'format':'bestaudio/best',
            'noplaylist':True,
            'quiet':True
        }

        if(type_video=="playlist"):
            video_opts['noplaylist']=False
            audio_opts['noplaylist']=False

        with yt_dlp.YoutubeDL(video_opts) as ydl_video:
            video_info = ydl_video.extract_info(url, download=False)
        
        with yt_dlp.YoutubeDL(audio_opts) as ydl_audio:
            audio_info = ydl_audio.extract_info(url, download=False)

        if video_info==[] or video_info=={}:
            return jsonify({"message":"Video not found"}),400
        
        video_url = None
        audio_url = None
        subtitle_url = None
        title_url=None

        if(type_video=="single"):
            subtitle=None
            captions=video_info.get('automatic_captions', {}).get('en-orig', [])

            for caption in captions:
                if(caption["ext"]=="vtt"):
                    subtitle=caption["url"]

            return jsonify({
                "title_url":video_info.get("title"),
                "video_url":video_info.get('url'),
                "audio_url":audio_info.get("url"),
                "subtitle_url":subtitle
            })
        
        else:
            if "entries" in video_info:
                title_url=[]
                video_url=[]
                audio_url=[]
                subtitle_url=[]
                
                for i in range(len(video_info["entries"])):
                    title_url.append(video_info["entries"][i]["title"])
                    video_url.append(video_info["entries"][i]["url"])
                    audio_url.append(audio_info["entries"][i]["url"])
                    captions=video_info["entries"][i].get('automatic_captions', {}).get('en-orig', [])
                    subtitle=None
                    for caption in captions:
                        if(caption["ext"]=="vtt"):
                            subtitle=caption["url"]
                    subtitle_url.append(subtitle)
                        
            
            return jsonify({
                "title_url":title_url,
                "video_url":video_url,
                "audio_url":audio_url,
                "subtitle_url":subtitle_url
            })

    
    except Exception as e:
        return jsonify({str(e)}),400

@app.route('/youtube/downloadVideo', methods=['POST'])
def download_url():
    data = request.get_json()
    video_url = data.get('url')
    quality = data.get('quality')
    type_video=data.get("type")

    if not video_url:
        return jsonify({"error": "URL is required"}), 400

    try:
        result=None
        if(quality=="high"):
            result = get_download_url(video_url,type_video)
        else:
            result=get_low_download_url(video_url,type_video)
        
        if result!=None:
            return result, 200
        else:
            return jsonify({"error": "Failed to fetch download url"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)