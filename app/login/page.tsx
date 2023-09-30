"use client";
import { useAppDispatch } from "@/src/store";
import { setAuth, setUserData } from "@/src/store/slices/auth-slices";
import { setPeringatan } from "@/src/store/slices/main-slices";
import {
  LoginProps,
  loginData,
  loginValidation,
} from "@/src/validation/login-validation";
import { Button, Card, CardBody, Input } from "@material-tailwind/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";

const Login = () => {
  const route = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async (value: LoginProps) => {
    try {
      if (value.username !== "admin" && value.password !== "admin") {
        dispatch(
          setPeringatan({
            message: "Password / Username salah!",
            show: true,
            type: "error",
          })
        );
        return;
      }
      dispatch(
        setPeringatan({
          message: "Login berhasil",
          show: true,
          type: "success",
        })
      );
      dispatch(setAuth(true));
      dispatch(
        setUserData({
          username: value.username,
          password: value.password,
        })
      );
      route.push("/");
    } catch (err) {
      dispatch(
        setPeringatan({
          message: "Terjadi kesalahan",
          type: "error",
          show: true,
        })
      );
      console.log(err);
    }
  };
  return (
      <div className="w-screen h-screen flex items-center">
        <Card className="w-[300px] p-3 mx-auto my-auto">
          <CardBody className="p-0">
            <Formik
              initialValues={loginData}
              validationSchema={loginValidation}
              onSubmit={async (values) => {
                handleLogin(values);
                return false;
              }}
            >
              {({ values, errors, setFieldValue }) => (
                <Form className="space-y-2">
                  <h2 className="text-gray-800 font-extrabold text-4xl">
                    Kuisis.
                  </h2>
                  <Input
                    color="indigo"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={(e) => {
                      setFieldValue("username", e.target.value);
                    }}
                    label={errors.username ? errors.username : "Username"}
                    crossOrigin={""}
                  />
                  <Input
                    color="indigo"
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={(e) => {
                      setFieldValue("password", e.target.value);
                    }}
                    type="password"
                    label={errors.password ? errors.password : "Password"}
                    crossOrigin={""}
                  />
                  <Button
                    className="w-full"
                    variant="outlined"
                    value={values.password}
                    type="submit"
                    color="gray"
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </div>
  );
};

export default Login;
