/**
 * Adds formdata fields for corresponding list of images with the key 'image{n}'.
 * 
 * @param formdata Formdata object that the image fields are going to be added to
 * @param images List of images to be added to formdata
 */
export const addImagesToFormData = async (formdata: FormData, images: ImageEntry[]) => {
    const imagePromises = images.map(async (image, idx) => {
      const res = await fetch(image.url);
      const blob = await res.blob();
      const file = new File([blob], `image-${idx}.jpeg`, { type: 'image/jpeg' });
      formdata.append(`image${idx}`, file);
    });
    await Promise.all(imagePromises);
};
