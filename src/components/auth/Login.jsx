import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().required("Password required"),
  });

  const handleLogin = async (value) => {
    try {
      const response = await axios.post(`${apiUrl}auth/login`, value);
      sessionStorage.setItem('auth_token', response.data.token)
      console.log("Bien ahi wachin, lo lograste!", response.data.token);
      navigate('/');
    } catch (error) {
      console.error("La cagaste en el login hermano: ", error);
    }
  };

  const LoginForm = () => (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={(values) => {
        handleLogin(values);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <Label htmlFor="email">Email</Label>
            <Field as={Input} type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Field
              as={Input}
              type="password"
              name="password"
              placeholder="Password"
            />
            <ErrorMessage name="password" component="div" />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );

  return(
    <>
        <LoginForm />
        <Link to={'/register'}>Register here</Link>
    </>
  );
}
