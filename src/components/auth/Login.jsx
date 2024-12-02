import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
import { Mail, Lock } from "lucide-react";
import Layout from "./Layout";

export default function Login() {

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().required("Password required"),
  });

  const handleLogin = async (value, { setStatus, setSubmitting }) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, value);
      sessionStorage.setItem("auth_token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error("Error logging in: ", error);
      setStatus("Invalid email or password");
    } finally {
      setSubmitting(false)
    }
  };

  const LoginForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values, {setStatus, setSubmitting}) => {
          handleLogin(values, {setStatus, setSubmitting});
        }}
      >
        {({ status, isSubmitting }) => (
          <Form>
            {status && <div className="text-red-500 font-semibold text-center">{ status }</div>}
            <CardContent className="space-y-4">
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
                    placeholder="Enter your password"
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
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-sm text-center text-gray-500">
                Don&apos;t have an account?
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Register here
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
      <LoginForm />
    </Layout>
  );
}
