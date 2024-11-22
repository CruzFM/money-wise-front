import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Register() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    username: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (value) => {
    console.log(value);
    try {
      const response = await axios.post(`${apiUrl}auth/register`, value);
      console.log("usuario registrado", response);
      navigate("/login");
    } catch (error) {
      console.error("la cagaste en el registro: ", error);
    }
  };

return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={ (values) => {
        handleSubmit(values);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <Label htmlFor="username">Username</Label>
            <Field
              as={Input}
              type="text"
              name="username"
              placeholder="Username"
            />
            <ErrorMessage name="username" component="div" />
          </div>
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


}
