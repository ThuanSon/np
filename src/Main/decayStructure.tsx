import axios from "axios";
import React, { useState, useEffect } from "react";
import go from "../lib/syntree";
import Loader from "../Components/Loader";

interface DecayStructureProps {
  data: string;
}

interface ApiResponseData {
  // Define the expected structure of the data returned from the API
  id: number;
  content: string;
  // Add more fields as necessary
}

const DecayStructure: React.FC<DecayStructureProps> = ({ data }) => {
  const [resData, setResData] = useState<ApiResponseData[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to handle and format the input data
  const handleData = () => {
    return data.split(" ").filter((item: string) => item !== "");
  };

  const output = handleData();

  // Function to fetch data from the API
  const fetchData = async (data: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/${data}`);
      setResData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      fetchData(data); // Fetch data when component is mounted or data prop changes
    }
  }, [data]);

  useEffect(() => {
    // Assuming go is a predefined function
    if (resData.length > 0) {
      const img = go(
        resData,
        14,
        "italic 14pt sans-serif",
        "bold 12pt sans-serif",
        30,
        20,
        true,
        true
      );

      const imageContainer = document.getElementById("image-goes-here");
      if (imageContainer) {
        imageContainer.innerHTML = ""; // Clear existing content

        // Check if img is an HTMLImageElement before appending
        if (img instanceof HTMLImageElement) {
          imageContainer.appendChild(img);
        } else {
          console.error("Expected an HTMLImageElement but got something else.");
        }
      }
    }
  }, [resData]);

  return (
    <div>
      {loading ? (
        <p><Loader/></p>
      ) : (
        <div id="image-goes-here"></div>
      )}
    </div>
  );
};

export default DecayStructure;
