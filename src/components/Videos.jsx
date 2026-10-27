import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        const fetchAllVideos = async () => {
            setLoading(true);
            let allVideos = [];
            let nextPageToken = "";

            try {
                do {
                    const response = await axios.get(
                        "https://www.googleapis.com/youtube/v3/playlistItems",
                        {
                            params: {
                                key: import.meta.env.VITE_API_KEY,
                                part: "snippet",
                                playlistId: "PLeiKpC4ACWqpEVI5_hu-AZwF65JW8Y3NP",
                                maxResults: 50,
                                pageToken: nextPageToken || undefined,
                            },
                        }
                    );

                    allVideos = allVideos.concat(response.data.items).reverse();
                    nextPageToken = response.data.nextPageToken;
                } while (nextPageToken);
                await sleep(2000);
                setVideos(allVideos);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch playlist videos");
            } finally {
                setLoading(false);
            }
        };

        fetchAllVideos();
    }, []);

    if (loading) {
        return (
            <section className="videos-section">
                <div className="video-container">
                    <div className="video-grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="card skeleton" />
                        ))}
                    </div>
                </div>
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </section >
        );
    }

    return (
        <div className="videos-section">
            <h1>Pay To Lose Videos</h1>
            <div className="video-container">
                <div className="video-grid">
                    {videos.map(item => {
                        const videoId = item.snippet.resourceId.videoId;

                        return (
                            <a
                                key={videoId}
                                href={`https://www.youtube.com/watch?v=${videoId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="card"
                            >
                                <img
                                    src={item.snippet.thumbnails.medium.url}
                                    alt={item.snippet.title}
                                />
                                <h3>{item.snippet.title}</h3>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div >
    )
}
