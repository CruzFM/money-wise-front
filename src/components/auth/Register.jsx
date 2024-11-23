import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { User, Mail, Lock } from "lucide-react";
import Layout from "./Layout";

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

  const RegisterForm = () => (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to get started
        </CardDescription>
      </CardHeader>

      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <CardContent className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Field
                    as={Input}
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className="pl-10"
                  />
                </div>
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="pl-10"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Field
                    as={Input}
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    className="pl-10"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>

              <div className="text-sm text-center text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );

  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
}
