export const dtoConvert = (dto) => {
  const formData = new FormData();
  for (const key in dto) {
    if (dto.hasOwnProperty(key)) {
      formData.append(key, dto[key]);
    }
  }
  return formData;
};
