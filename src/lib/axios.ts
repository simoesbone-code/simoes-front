import axios from "axios";

const URL = "https://simoes-back.vercel.app";

/* https://simoes-back.vercel.app */

/* localhost:5000 */
export default axios.create({
  baseURL: URL,
});
