import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import HeroSlide from "../components/common/HeroSlide";
import MediaGrid from "../components/common/MediaGrid";
import uiConfigs from "../configs/ui.configs";
import usePrevious from "../hooks/usePrevious";
import { setAppState } from "../redux/features/appStateSlice";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";

const MediaList = () => {
  const { mediaType } = useParams();

  const [medias, setMedias] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [currCategory, setCurrCategory] = useState(0);
  const [mediaLoading, setMediaLoading] = useState(false);

  const prevMediaType = usePrevious(mediaType);
  const dispatch = useDispatch();

  const mediaCategories = useMemo(() => ["popular", "top_rated"], []);
  const category = ["popular", "top rated"];

  useEffect(() => {
    dispatch(setAppState(mediaType));
    window.scrollTo(0, 0);
  }, [mediaType, dispatch]);

  useEffect(() => {
    const getMedias = async () => {
      if (currPage === 1) dispatch(setGlobalLoading(true));
      setMediaLoading(true);

      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory: mediaCategories[currCategory],
        page: currPage,
      });

      setMediaLoading(false);
      dispatch(setGlobalLoading(false));

      if (err) toast.error(err.message);
      if (response) {
        if (currPage !== 1) setMedias((m) => [...m, ...response.results]);
        else setMedias([...response.results]);
      }
    };

    if (prevMediaType !== mediaType) {
      setCurrPage(1);
      setCurrCategory(0);
    }

    getMedias();
  }, [
    mediaType,
    prevMediaType,
    mediaCategories,
    currCategory,
    currPage,
    dispatch,
  ]);

  const onCategoryChange = (categoryIndex) => {
    if (currCategory === categoryIndex) return;
    setMedias([]);
    setCurrPage(1);
    setCurrCategory(categoryIndex);
  };

  const onLoadMore = () => setCurrPage(currPage + 1);

  return (
    <>
      <HeroSlide
        mediaType={mediaType}
        mediaCategory={mediaCategories[currCategory]}
      />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginBottom: 4 }}
        >
          <Typography fontWeight="700" variant="h4">
            {mediaType === tmdbConfigs.mediaType.movie ? "Movies" : "TV Shows"}{" "}
          </Typography>
          <Stack direction="row" spacing={2}>
            {category.map((cate, index) => (
              <Button
                key={index}
                size="large"
                variant={currCategory === index ? "contained" : "outlined"}
                onClick={() => onCategoryChange(index)}
                sx={{
                  color:
                    currCategory === index
                      ? "primary.contrastText"
                      : "text.primary",
                }}
              >
                {cate}
              </Button>
            ))}
          </Stack>
        </Stack>
        <MediaGrid medias={medias} mediaType={mediaType} />
        <LoadingButton
          loading={mediaLoading}
          onClick={onLoadMore}
          sx={{ marginTop: 8 }}
          fullWidth
          color="primary"
        >
          load more
        </LoadingButton>
      </Box>
    </>
  );
};

export default MediaList;
