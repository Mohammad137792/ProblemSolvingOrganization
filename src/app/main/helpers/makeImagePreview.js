/**
 * @author Farbod Shams <farbodshams.2000@gmail.com>
 * To use this function you have to have an input element of type file besides an image element with the id of
 * "imagePreview-[YOUR INPUT ID]" so this function can render the selected image in input feild to image element.
 * @param input: it's an input field with type=file
 */

const makeImagePreview = input => {
    input = input.target;
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById("imagePreview-" + input.id).setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

export default makeImagePreview;