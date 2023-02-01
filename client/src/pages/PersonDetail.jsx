import { Box, Stack, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import tmdbConfigs from "../api/configs/tmdb.configs"
import personApi from "../api/modules/person.api"
import Container from "../components/common/Container"
import PersonMediaGrid from "../components/common/PersonMediaGrid"
import uiConfigs from "../configs/ui.configs"
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"

const PersonDetail = () => {
  const { personId } = useParams()
  const [person, setPerson] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    const getPerson = async () => {
      dispatch(setGlobalLoading(true))
      const { response, err } = await personApi.detail({personId})
      dispatch(setGlobalLoading(false))
      if (err) toast.error(err.message)
      if (response) setPerson(response)
    }
    getPerson()
  },[personId, dispatch])

  return (
    <>
      <Toolbar />
      {person && (
        <>
          <Box sx={{ ...uiConfigs.style.mainContent }}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box
                sx={{
                  width: { xs: "50%", md: "20%" },
                }}
              >
                <Box
                  sx={{
                    paddingTop: "160%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "darkgrey",
                    backgroundImage: `url(${tmdbConfigs.posterPath(
                      person.profile_path
                    )})`,
                    borderRadius: "16px"
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: { xs: "100%", md: "80%" },
                  padding: { xs: "1rem 0", md: "1rem 2rem" },
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h5" fontWeight="700">
                    {`${person.name} (${person.birthday.split("-")[0]}`}
                    {person.deathday && `- ${person.deathday.split("-")[0]}`}
                    {")"}
                  </Typography>
                  <Typography sx={{ ...uiConfigs.style.typoLines(10) }}>
                    {person.biography}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            <Container header="medias">
              <PersonMediaGrid personId={personId} />
            </Container>
          </Box>
        </>
      )}
    </>
  );
}

export default PersonDetail