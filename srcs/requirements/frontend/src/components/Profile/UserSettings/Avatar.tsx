import React, { Fragment, useState } from "react";
import JoinFileSvg from "../../../assets/joinFile.svg";
import DeleteSvg from "../../../assets/deleteSvg.svg";
import { GetAvatar, PostAvatar } from "../../../api/axios";
import { useGlobalContext } from "../../../provider/AppContext";
import { Button, Dialog } from "@material-tailwind/react";
import Cookies from "js-cookie";
import { Alert } from "@material-tailwind/react";
import Notification from "../../common/Notification";
import { getAvatarUrl } from "../../common/CommonFunc";

function Avatar() {
	const { userImg, setUserImg } = useGlobalContext();

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState("");
	const [imgPreview, setImgPreview] = useState<string | ArrayBuffer | null>(""); // [1
	const [open, setOpen] = useState(false);
	const handelOpen = () => {
		setOpen(!open);
		console.log(open);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target && event.target.files) {
			const fileName = event.target.value.split("\\").pop();
			if (fileName) setFileName(fileName);
			setSelectedFile(event.target.files[0]);
			if (event.target.files[0]) {
				setImgPreview(URL.createObjectURL(event.target.files[0]));
				handelOpen();
			}
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		console.log("File selected:");
		if (!selectedFile) {
			console.log("No file selected");
			return;
		}
		handelOpen();

		PostAvatar(selectedFile)
			.then(() => {
				console.log("File uploaded!");
				// GetAvatar(Cookies.get("userid") || "").then((res) => {
				//   setUserImg(res);
				// });
				setUserImg(getAvatarUrl());
			})
			.catch((error) => {
				console.log("Error uploading file:", error);
			});
	};

	return (
		<div className="flex flex-col items-center gap-5">
			<img src={userImg} alt="" width={200} />
			<label>
				<div className="border  rounded-md overflow-hidden h-[3rem] border-dashed border-gray-500 relative flex items-center bg-slate-300/10">
					<input
						accept="image/*"
						type="file"
						multiple
						className="cursor-pointer relative block opacity-0 w-full h-full  z-50"
						onChange={handleFileChange}
						name="file"
					/>
					<div className="text-center   absolute top-0 right-0 left-0 m-auto">
						<div className="flex justify-center items-center ">
							{fileName ? (
								<div className="flex justify-between items-center bg-[#EFEFEF] p-2 w-full h-[3rem] text-gray-800 ">
									<p> {fileName}</p>

									<img
										className="z-[100] cursor-pointer hover:scale-110 transition-all ease-in-out duration-200"
										src={DeleteSvg}
										alt=""
										onClick={() => setFileName("")}
									/>
								</div>
							) : (
								<div className="flex justify-center gap-2 items-center  p-2 w-full h-[3rem]">
									<img src={JoinFileSvg} alt="" />
									<p>Upload your profile picture here</p>
								</div>
							)}
							<h4> </h4>
						</div>
					</div>
				</div>
			</label>
			<Notification
				message="Profile picture updated successfully"
				type="green"
				delay={1000}
			/>
			{/* /// image preview  */}
			<Dialog
				size="sm"
				open={open}
				handler={handelOpen}
				className="flex flex-col gap-4 items-center justify-center p-10"
			>
				{imgPreview && (
					<img src={imgPreview as string} alt="" width={100} className="p-4" />
				)}
				<button
					className="bg-cyan-800 py-2 px-4 mt-4 shadow-md shadow-white/10 hover:scale-105 transition-all ease-in-out duration-200 rounded-md text-blue-gray-50 text-lg"
					onClick={(e: any) => handleSubmit(e)}
				>
					Submit
				</button>
			</Dialog>
		</div>
	);
}

export default Avatar;
