import { LoadingButton } from "@mui/lab";
import { Box, TextField, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import { setUser } from "../redux/features/userSlice";
import userApi from "../api/modules/user.api";
import { setAuthModalOpen } from "../redux/features/authModalSlice";

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      newPassword: Yup.string()
        .min(8, "New password must be at least 8 characters")
        .required("New password is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Confirm New Password does not match")
        .min(8, "New password must be at least 8 characters")
        .required("Confirm new password is required"),
    }),
    onSubmit: async (values) => onUpdate(values),
  });

  const onUpdate = async (values) => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await userApi.passwordUpdate(values);
    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      toast.success("Password updated! Please re-login");
    }
  };

  return (
    <Box
      sx={{
        ...uiConfigs.style.mainContent,
        marginLeft: "5rem",
        marginTop: "2.5rem",
      }}
    >
      <Container header="update password">
        <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              type="password"
              placeholder="password"
              name="password"
              fullWidth
              color="success"
              value={form.values.password}
              onChange={form.handleChange}
              error={
                form.touched.password && form.errors.password !== undefined
              }
              helperText={form.touched.password && form.errors.password}
            />
            <TextField
              type="password"
              placeholder="new password"
              name="newPassword"
              fullWidth
              color="success"
              value={form.values.newPassword}
              onChange={form.handleChange}
              error={
                form.touched.newPassword &&
                form.errors.newPassword !== undefined
              }
              helperText={form.touched.newPassword && form.errors.newPassword}
            />
            <TextField
              type="password"
              placeholder="confirm new password"
              name="confirmNewPassword"
              fullWidth
              color="success"
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              error={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword !== undefined
              }
              helperText={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword
              }
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              loading={onRequest}
              sx={{ marginTop: 4 }}
            >
              update password
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PasswordUpdate;
