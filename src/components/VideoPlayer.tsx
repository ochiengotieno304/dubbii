import ReactPlayer from "react-player"

interface VideoPlayerProps {
    videoUrl: string;
}

const VideoPlayer = ({videoUrl}: VideoPlayerProps) => {
    return (
        <div>
            <ReactPlayer url={videoUrl} controls={true} width='100%' height='100%'/>
        </div>
    )
}

export default VideoPlayer;