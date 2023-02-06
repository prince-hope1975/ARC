import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";

dotenv.config();

const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;

import axios from "axios";

export const pinJSONToIPFS = async <T>(JSONBody: T) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  // making axios POST request to Pinata ⬇️
  console.log(JSONBody);
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        gateWayUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        ipfsHash: "ipfs://" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      // console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

const JWT = `Bearer ${process.env.PINATA_JWT}`;

export const pinFileToIPFS = async (src: string): Promise<{ IpfsHash: string }|undefined> => {
  const formData = new FormData();

  const file = fs.createReadStream(src);
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: file.path,
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          // @ts-ignore
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
