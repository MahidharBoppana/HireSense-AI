import mammoth from "mammoth";

const extractTextFromDocx = async (buffer) => {
  const { value } = await mammoth.extractRawText({
    buffer,
  });

  return value;
};

export default extractTextFromDocx;