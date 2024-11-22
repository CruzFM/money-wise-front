import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { Button } from "@/components/ui/button";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios from "axios";

export default function Register() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const SignupSchema = Yup.object().shape({
    username: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={async (values) => {
        console.log(values);
        try {
          const response = await axios.post(`${apiUrl}auth/register`, values);
          console.log("usuario registrado", response);
        } catch (error) {
          console.error("la cagaste en el registro: ", error);
        }
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
