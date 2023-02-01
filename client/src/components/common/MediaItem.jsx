import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import uiConfigs from "../../configs/ui.configs";
import { routesGen } from "../../routes/routes";
import FavoriteIcon from "@mui/icons-material/Favorite"
import CircularRate from "./CircularRate";
import { useSelector } from "react-redux";
import favouriteUtils from "../../utils/favourite.utils"

const MediaItem = ({ media, mediaType }) => {
    const {listFavourites } = useSelector((state) => state.user);

    const [title, setTitle] = useState("")
    const [posterPath, setPosterPath] = useState("")
    const [releaseDate, setReleaseDate] = useState(null)
    const [rate, setRate] = useState(null)

    useEffect(() => {
        setTitle(media.title || media.name || media.mediaTitle)
        setPosterPath(tmdbConfigs.posterPath(media.poster_path || media.backdrop_path || media.mediaPoster || media.profile_path))
        if (mediaType === tmdbConfigs.mediaType.movie) {
            setReleaseDate(media.release_date && media.release_date.split("-")[0])
        } else {
            setReleaseDate(media.first_air_date && media.first_air_date.split("-")[0])
        }
        setRate(media.vote_average || media.mediaRate)
    },[media, mediaType])

    return (
      <Link
        to={
          mediaType !== "people"
            ? routesGen.mediaDetail(mediaType, media.id || media.mediaid)
            : routesGen.person(media.id)
        }
      >
        <Box
          sx={{
            ...uiConfigs.style.backgroundImage(posterPath),
            paddingTop: "160%",
            "&:hover .media-info": { opacity: 1, bottom: 0 },
            "&:hover .media-play-btn, &:hover .media-back-drop": { opacity: 1 },
            color: "primary.contrastText",
            borderRadius: "6px",
          }}
        >
            {/* movie or tv item */}
            {mediaType !== "people" && (
                <>
                    {favouriteUtils.check({ listFavourites, mediaId: media.id }) && (
                        <FavoriteIcon
                            color="primary"
                            sx={{
                                position: "absolute",
                                top: 2,
                                right: 2,
                                fontSize: "2rem"
                            }}
                        />
                    )}
                    <Box className="media-back-drop" sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
                        opacity: { xs: 1, md: 0},
                        transition: "all 0.3s ease"
                    }} />
                    <Button
                        className="media-play-btn"
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            opacity: 0,
                            transition: "all 0.3s ease",
                            display: { xs: "npne", md: "flex" },
                            "& .MuiButton-startIcon": { marginRight: "-4px" }
                        }}
                    />
                    <Box className="media-info" sx={{
                        position: "absolute",
                        width: "100%",
                        height: "max-content",
                        bottom: { xs: 0, md: "-20px" },
                        padding: { xs: "10px", md: "2rem 1rem"},
                        opacity: { xs: 1, md: 0},
                        transition: "all 0.3s ease",
                        boxSizing: "border-box",
                        paddingX: {xs: "10px", md: "2rem 1rem"}
                    }}>
                        <Stack spacing={{ xs: 1, md: 2 }}>
                            {rate && <CircularRate value={rate} />}

                            <Typography>{releaseDate}</Typography>

                            <Typography
                                variant="body1"
                                fontWeight="700"
                                sx={{
                                    fontSize: "1rem",
                                    ...uiConfigs.style.typoLines(1, "left")
                                }}
                            >
                                {title}
                            </Typography>
                        </Stack>
                    </Box>
                </>
            )}
            {/* movie or tv item */}

            {/* people */}
            {mediaType === "people" && (
                <Box sx={{
                    position: "absolute",
                    width: "100%",
                    height: "max-content",
                    bottom: 0,
                    padding: "10px",
                    backgroundColor: "rgba(0,0,0,0.6)",
                }}>
                    <Typography sx={{ ...uiConfigs.style.typoLines(1, "left")}}>
                        {media.name}
                    </Typography>
                </Box>
            )}
            {/* people */}
        </Box>
      </Link>
    );
};

export default MediaItem