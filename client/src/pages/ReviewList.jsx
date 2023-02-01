import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import tmdbConfigs from "../api/configs/tmdb.configs";
import reviewApi from "../api/modules/review.api";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { routesGen } from "../routes/routes";

const ReviewItem = ({ review, onRemoved }) => {
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await reviewApi.remove({
      reviewId: review.id,
    });
    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      toast.success("Review removed successfully");
      onRemoved(review.id);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        flexDirection: { xs: "column", md: "row" },
        padding: 1,
        opacity: onRequest ? 0.6 : 1,
        "&:hover": { backgroundColor: "background.paper" },
      }}
    >
      <Box sx={{ width: { xs: 0, md: "10%" } }}>
        <Link
          to={routesGen.mediaDetail(review.mediaId, review.mediaType)}
          style={{ textDecoration: "none", color: "unset" }}
        >
          <Box
            sx={{
              paddingTop: "160%",
              ...uiConfigs.style.backgroundImage(
                tmdbConfigs.posterPath(review.mediaPoster)
              ),
            }}
          />
        </Link>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "80%" },
          padding: { xs: 0, md: "0 2rem" },
        }}
      >
        <Stack spacing={1}>
          <Link
            to={routesGen.mediaDetail(review.mediaId, review.mediaType)}
            style={{ textDecoration: "none", color: "unset" }}
          >
            <Typography
              variant="h6"
              sx={{ ...uiConfigs.style.typoLines(1, "left") }}
            >
              {review.mediaTitle}
            </Typography>
          </Link>
          <Typography variant="caption">
            {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Typography>
          <Typography>{review.content}</Typography>
        </Stack>
      </Box>

      <LoadingButton
        variant="contained"
        startIcon={<DeleteIcon />}
        onClick={onRemove}
        loading={onRequest}
        loadingPosition="start"
        sx={{
          position: { xs: "ralative", md: "absolute" },
          right: { xs: 0, md: "10px" },
          marginTop: { xs: 2, md: 0 },
          width: "max-content",
        }}
      >
        Remove
      </LoadingButton>
    </Box>
  );
};

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const skip = 2;

  const dispatch = useDispatch();

  useEffect(() => {
    const getReviews = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await reviewApi.getList();
      dispatch(setGlobalLoading(false));

      if (err) toast.error(err.message);
      if (response) {
        setReviews([...response]);
        setCount(response.length);
        setFilteredReviews([...response].splice(0, skip));
      }
    };

    getReviews();
  }, [dispatch]);

  const onLoadMore = () => {
    const nextReviews = [...reviews].splice(skip * page, skip);
    setFilteredReviews([...filteredReviews, ...nextReviews]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newReviews = [...reviews].filter((m) => m.id !== id);
    setReviews(newReviews);
    setFilteredReviews([...newReviews].splice(0, page * skip));
    setCount(count - 1);
  };
  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Your reviews (${count})`}>
        <Stack spacing={2}>
          {filteredReviews.map((review) => (
            <Box key={review.id}>
              <ReviewItem review={review} onRemoved={onRemoved} />
              <Divider sx={{ display: { xs: "block", md: "none" } }} />
            </Box>
          ))}
          {filteredReviews.length < reviews.length && (
            <Button onClick={onLoadMore}>load more</Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ReviewList;
