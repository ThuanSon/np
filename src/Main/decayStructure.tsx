import axios from "axios";
import React, { useState, useEffect } from "react";
import go from "../lib/syntree";
import Loader from "../Components/Loader";

interface DecayStructureProps {
  data: string[];
}

interface ApiResponseData {
  id: number;
  content: string;
  // Add more fields as necessary
}

const DecayStructure: React.FC<DecayStructureProps> = ({ data }) => {
  const [resData, setResData] = useState<ApiResponseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [spellCheck, setSpellCheck] = useState(true);
  const [fixedWord, setFixedWord] = useState("");

  // Function to handle and format the input data
  const handleData = () => {
    return data.map((d) => d.split(" ").filter((item: string) => item !== ""));
  };

  const output = handleData(); // Processed data (returns an array of arrays)

  // Function to fetch data from the API
  const fetchData = async (data: string) => {
    if (data !== "") {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/${data}`);
        // const res = await axios.get(`https://api-np.onrender.com/${data}`);
        setResData(res.data?.message); // Set the response data
        setSpellCheck(res?.data?.spellcheck);
        setFixedWord(res?.data?.fixedWord);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("There's emty value, miss it?");
    }
  };

  useEffect(() => {
    if (data) {
      // Fetch data when the component is mounted or data prop changes
      data.forEach((d) => fetchData(d));
    }
  }, [data]);

  useEffect(() => {
    if (resData.length > 0) {
      // Assuming go is a predefined function that generates an image
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

      // Iterate through data and append the image to the corresponding element
      data.forEach((a) => {
        const imageContainer = document.getElementById(a);
        const errorContainer = document.getElementById(`${a}-error`); // Use a separate error container

        if (imageContainer) {
          if (img instanceof HTMLImageElement) {
            imageContainer.appendChild(img); // Append the image if it's a valid image element
          } else {
            // Show error message if something goes wrong
            if (errorContainer) {
              errorContainer.innerHTML =
                "Something went wrong, please try again";
            }
          }
        }
      });
    }
  }, [resData, data]);

  const checkSpell = () => {
    return (
      <>
        {spellCheck || fixedWord === "fail to check spell"  || fixedWord === undefined? (
          <div></div>
        ) : (
          <div>
            <span>Here is the correct ordered word: </span>
            <i>{'"' + fixedWord + '"'}</i>
          </div>
        )}
      </>
    );
  };
  return (
    <div>
      {loading ? (
        <Loader /> // Show loader while fetching data
      ) : (
        <>
          <div id="image">
            {checkSpell()}
            {data.map((d) => (
              <div>
                <div key={d} id={d}></div>
                <div
                  id={`${d}-error`}
                  style={{ color: "red", fontWeight: "bold" }}
                ></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DecayStructure;
