import { LoadingButton } from "@mui/lab"
import { Box, Button, Stack, TextField, Toolbar } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import mediaApi from "../api/modules/media.api"
import MediaGrid from "../components/common/MediaGrid"
import uiConfigs from "../configs/ui.configs"

const mediaTypes = ["movie", "tv", "people"]
let timer;
const timeout = 500

const MediaSearch = () => {
  const [medias, setMedias] = useState([])
  const [page, setPage] = useState(1)
  const [onSearch, setOnSearch] = useState(false)
  const [query, setQuery] = useState("")
  const [mediaType, setMediaType] = useState(mediaTypes[0])

  const search = useCallback(async () => {
    if (query === "") return toast.error("Please enter a search query")
    setOnSearch(true)
    const { response, err } = await mediaApi.search({
      mediaType,
      query,
      page
    })
    setOnSearch(false)
    if (err) return toast.error(err.message)
    if (response) {
      if (page === 1) setMedias([...response.results])
      else setMedias((m) => [...m, ...response.results])
    }
  }, [mediaType, query, page])

  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([])
      setPage(1)
    } else search()
  },[search, query, mediaType, page])

  useEffect(() => {
    setMedias([])
    setPage(1)
  },[mediaType])

  const onCategoryChange = (selectedCategory) => setMediaType(selectedCategory)

  const onQueryChange = (e) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      setQuery(e.target.value);
    }, timeout)
  }

  return (
    <>
      <Toolbar />
      <Box sx={{...uiConfigs.style.mainContent}}>
        <Stack spacing={2}>
          <Stack 
            direction="row" 
            spacing={2}
            justifyContent="center"
            sx={{width: "100%"}}
          >
            {mediaTypes.map((type, index) => (
              <Button
                key={index}
                size="large"
                variant={mediaType === type ? "contained" : "text"}
                sx={{color: mediaType === type ? "primary.contrastText" : "text.primary"}}
                onClick={() => onCategoryChange(type)}
              >
                {type}
              </Button>
            ))}
          </Stack>
          <TextField 
            color="success"
            placeholder="Search FilmFiesta"
            sx={{width: "100%"}}
            onChange={onQueryChange}
            autoFocus
          />

          <MediaGrid medias={medias} mediaType={mediaType} />

          {medias.length > 0 && (
            <LoadingButton
              loading={onSearch}
              onClick={() => setPage(page + 1)}
            >
              Load More
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  )
}

export default MediaSearch