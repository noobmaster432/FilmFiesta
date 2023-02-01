import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import favouriteApi from "../api/modules/favourite.api";
import Container from "../components/common/Container";
import MediaItem from "../components/common/MediaItem";
import uiConfigs from "../configs/ui.configs";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { removeFavourite } from "../redux/features/userSlice";

const FavouriteItem = ({ media, onRemoved }) => {
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await favouriteApi.remove({
      favouriteId: media.id,
    });
    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      toast.success("Removed from favourites");
      dispatch(removeFavourite({ mediaId: media.mediaId }));
      onRemoved(media.id);
    }
  };

  return (
    <>
      <MediaItem media={media} mediaType={media.mediaType} />
      <LoadingButton
        fullWidth
        variant="contained"
        sx={{ marginTop: 2 }}
        startIcon={<DeleteIcon />}
        onClick={onRemove}
        loading={onRequest}
        loadingPosition="start"
      >
        remove
      </LoadingButton>
    </>
  );
};

const FavouriteList = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const skip = 8;

  const dispatch = useDispatch();

  useEffect(() => {
    const getFavourites = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await favouriteApi.getList();
      dispatch(setGlobalLoading(false));

      if (err) toast.error(err.message);
      if (response) {
        setMedias([...response]);
        setCount(response.length);
        setFilteredMedias([...response].splice(0, skip));
      }
    };

    getFavourites();
  }, [dispatch]);

  const onLoadMore = () => {
    const nextMedias = [...medias].splice(skip * page, skip);
    setFilteredMedias([...filteredMedias, ...nextMedias]);
    setPage(page + 1);
  };

  const onRemoved = (favouriteId) => {
    const newMedias = [...medias].filter((m) => m.id !== favouriteId);
    setMedias(newMedias);
    setFilteredMedias([...newMedias].splice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Your favourites (${count})`}>
        <Grid container spacing={2} sx={{ marginRight: "-8px!important" }}>
          {filteredMedias.map((media, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <FavouriteItem media={media} onRemoved={onRemoved} />
            </Grid>
          ))}
        </Grid>
        {filteredMedias.length < medias.length && (
          <Button onClick={onLoadMore}>Load more</Button>
        )}
      </Container>
    </Box>
  );
};

export default FavouriteList;
