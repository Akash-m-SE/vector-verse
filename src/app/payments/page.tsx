import axios from "axios";
import { Projects } from "./columns";

export async function getData(): Promise<Projects[]> {
  const response = await axios.get("/api/dashboard");
  const { data } = response.data;

  return data;
}
