import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signupForm = useFormik({
    initialValues: {
      password: "",
      username: "",
      displayName: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
      displayName: Yup.string()
        .min(8, "displayName minimum 8 characters")
        .required("displayName is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "confirmPassword not match")
        .min(8, "confirmPassword minimum 8 characters")
        .required("confirmPassword is required"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, err } = await userApi.signup(values);
      setIsLoginRequest(false);
      console.log("asdasdasdasd", response, err)

      if (response) {
        signupForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Sign up success");
      }

      if (err) setErrorMessage(err.message);
    },
  });

  return (
    <Box component="form" onSubmit={signupForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="username"
          name="username"
          fullWidth
          value={signupForm.values.username}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.username &&
            signupForm.errors.username !== undefined
          }
          helperText={signupForm.touched.username && signupForm.errors.username}
        />
        <TextField
          type="text"
          placeholder="display name"
          name="displayName"
          fullWidth
          value={signupForm.values.displayName}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.displayName &&
            signupForm.errors.displayName !== undefined
          }
          helperText={
            signupForm.touched.displayName && signupForm.errors.displayName
          }
        />
        <TextField
          type="password"
          placeholder="password"
          name="password"
          fullWidth
          value={signupForm.values.password}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.password &&
            signupForm.errors.password !== undefined
          }
          helperText={signupForm.touched.password && signupForm.errors.password}
        />
        <TextField
          type="password"
          placeholder="confirm password"
          name="confirmPassword"
          fullWidth
          value={signupForm.values.confirmPassword}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword !== undefined
          }
          helperText={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword
          }
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        sign up
      </LoadingButton>

      <Button fullWidth sx={{ marginTop: 1 }} onClick={() => switchAuthState()}>
        sign in
      </Button>

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined">
            {errorMessage}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default SignupForm;
