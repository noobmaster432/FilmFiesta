import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CircularRate from "../components/common/CircularRate";
import ImageHeader from "../components/common/ImageHeader";
import Container from "../components/common/Container";

import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import favouriteApi from "../api/modules/favourite.api";

import { addFavourite, removeFavourite } from "../redux/features/userSlice";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import CastSlide from "../components/common/CastSlide";
import MediaVideosSlide from "../components/common/MediaVideosSlide";
import BackdropSlide from "../components/common/BackdropSlide";
import PosterSlide from "../components/common/PosterSlide";
import RecommendSlide from "../components/common/RecommendSlide";
import MediaSlide from "../components/common/MediaSlide";
import MediaReview from "../components/common/MediaReview";

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();

  const { user, listFavourites } = useSelector((state) => state.user);

  const [isFavourite, setIsFavourite] = useState(false);
  const [media, setMedia] = useState();
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();

  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await mediaApi.getDetail({
        mediaType,
        mediaId,
      });
      dispatch(setGlobalLoading(false));

      if (response) {
        setMedia(response);
        setIsFavourite(response.isFavourite);
        setGenres(response.genres.splice(0, 2));
      }

      if (err) toast.error(err.message);
    };

    getMedia();
  }, [mediaType, mediaId, dispatch]);

  const onFavouriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavourite) {
      onRemoveFavourite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.id,
      mediaType: mediaType,
      mediaTitle: media.title || media.name,
      mediaPoster: media.poster_path,
      mediaRate: media.vote_average,
    };

    const { response, err } = await favouriteApi.add(body);

    setOnRequest(false);

    if (response) {
      dispatch(addFavourite(response));
      setIsFavourite(true);
      toast.success("Added to your favourite list");
    }

    if (err) toast.error(err.message);
  };

  const onRemoveFavourite = async () => {
    if (onRequest) return;

    setOnRequest(true);

    const favourite = listFavourites.find(
      (e) => e.mediaId.toString() === media.id.toString()
    );

    const { response, err } = await favouriteApi.remove({
      favouriteId: favourite.id,
    });

    setOnRequest(false);

    if (response) {
      dispatch(removeFavourite(favourite));
      setIsFavourite(false);
      toast.success("Removed from your favourite list");
    }
    if (err) toast.error(err.message);
  };

  return media ? (
    <>
      <ImageHeader
        imgPath={tmdbConfigs.backdropPath(
          media.backdrop_path || media.poster_path
        )}
      />
      <Box
        sx={{
          color: "primary.contrastText",
          ...uiConfigs.style.mainContent,
        }}
      >
        {/* media content */}
        <Box
          sx={{
            marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
            }}
          >
            {/* poster */}
            <Box
              sx={{
                width: { md: "40%", sm: "50%", xs: "70%" },
                margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" },
              }}
            >
              <Box
                sx={{
                  paddingTop: "140%",
                  ...uiConfigs.style.backgroundImage(
                    tmdbConfigs.posterPath(
                      media.poster_path || media.backdrop_path
                    )
                  ),
                }}
              />
            </Box>
            {/* poster */}

            {/* media info */}
            <Box
              sx={{
                width: { md: "60%", xs: "100%" },
                color: "text.primary",
              }}
            >
              <Stack spacing={5}>
                {/* title */}
                <Typography
                  variant="h4"
                  fontSize={{ xs: "1.5rem", md: "2rem", lg: "4rem" }}
                  fontWeight="700"
                  sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                >
                  {`${media.title || media.name} ${
                    mediaType === tmdbConfigs.mediaType.movie
                      ? media.release_date.split("-")[0]
                      : media.first_air_date.split("-")[0]
                  }`}
                </Typography>
                {/* title */}

                {/* rate and genres */}
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* rate */}
                  <CircularRate value={media.vote_average} />
                  {/* rate */}
                  <Divider orientation="vertical" />
                  {/* genres */}
                  {genres.map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre.name}
                      variant="filled"
                      color="primary"
                    />
                  ))}
                  {/* genres */}
                </Stack>
                {/* rate and genres */}

                {/* overview */}
                <Typography
                  variant="body1"
                  sx={{ ...uiConfigs.style.typoLines(5) }}
                >
                  {media.overview}
                </Typography>
                {/* overview */}

                {/* button */}
                <Stack direction="row" spacing={1}>
                  <LoadingButton
                    variant="text"
                    sx={{
                      width: "max-content",
                      "& .MuiButton-startIcon": { marginRight: "0" },
                    }}
                    startIcon={
                      isFavourite ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderOutlinedIcon />
                      )
                    }
                    size="large"
                    loading={onRequest}
                    loadingPosition="start"
                    onClick={onFavouriteClick}
                  />
                  <Button
                    variant="contained"
                    sx={{ width: "max-content" }}
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => videoRef.current.scrollIntoView()}
                  >
                    watch now
                  </Button>
                </Stack>
                {/* button */}

                {/* cast */}
                <Container header="Cast">
                  <CastSlide casts={media.credits.cast} />
                </Container>
                {/* cast */}
              </Stack>
            </Box>
            {/* media info */}
          </Box>
        </Box>
        {/* media content */}

        {/* media videos */}
        <div ref={videoRef} style={{ paddingTop: "2rem" }}>
          <Container header="Videos">
            <MediaVideosSlide videos={media.videos.results.splice(0, 5)} />
          </Container>
        </div>
        {/* media videos */}

        {/* media backdrop */}
        {media.images.backdrops.length > 0 && (
          <Container header="backdrops">
            <BackdropSlide backdrops={media.images.backdrops} />
          </Container>
        )}
        {/* media backdrop */}

        {/* media posters */}
        {media.images.posters.length > 0 && (
          <Container header="posters">
            <PosterSlide posters={media.images.posters} />
          </Container>
        )}
        {/* media posters */}

        {/* media reviews */}
        <MediaReview reviews={media.reviews} media={media} mediaType={mediaType} />
        {/* media reviews */}

        {/* media recommendation */}
        <Container header="you may also like"> 
          {media.recommend.length > 0 && (
            <RecommendSlide medias={media.recommend} mediaType={mediaType} />
          )}
          {media.recommend.length === 0 && (
            <MediaSlide
              mediaType={mediaType}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          )}
        </Container>
        {/* media recommendation */}
      </Box>
    </>
  ) : null;
};

export default MediaDetail;
