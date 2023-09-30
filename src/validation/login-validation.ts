import * as Yup from "yup";

export interface LoginProps {
  username: string;
  password: string;
}

export const loginData: LoginProps = {
  username: "",
  password: "",
};

export const loginValidation = Yup.object().shape({
  username: Yup.string().required("Username dibutuhkan!"),
  password: Yup.string().required("Password dibutuhkan!"),
});
