
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

function UploadPdfDialog({ children, isMaxFile }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const AddFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const OnFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }
    setLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();

      const fileId = uuidv4();
      const fileUrl = await getFileUrl({ storageId: storageId });
      await AddFileEntry({
        fileId,
        storageId,
        fileUrl,
        fileName: fileName || "Untitled file",
        createdBy: user?.primaryEmailAddress?.emailAddress,
      }); // API call to fetch and process PDF data

      const response = await axios.get(
        `http://localhost:3000/api/pdf-loader/?pdfUrl=` + fileUrl
      );
      
      
      const res = await embeddDocument({
        splitText: response.data.result,
        fileId: fileId,
      });
      console.log("response from api",response.data.result);
      console.log("fileId",fileId);
      console.log("Embedding response:", res);
    } catch (error) {
      console.error("An error occurred during upload and embedding:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // const onUpload = async () => {

  //     if (!file) {
  //       console.error("No file selected.");
  //       return;
  //     }
  //     setLoading(true);
  //     const postUrl = await generateUploadUrl();
  //     const result = await fetch(postUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": file?.type },
  //       body: file,
  //     });
  //     const { storageId } = await result.json();

  //     const fileId = uuidv4();
  //     const fileUrl=await getFileUrl({storageId:storageId})
  //     const resp=await AddFileEntry({
  //       fileId,
  //       storageId,
  //       fileUrl,
  //       fileName: fileName || "Untitled file",
  //       createdBy: user?.primaryEmailAddress?.emailAddress,
  //     })
  //     console.log("response",resp);
  //     console.log("storageId", storageId);
  //    // api call to fetch pdf process data
  //     const response= await axios.get('http://localhost:3000/api/pdf-loader/?pdfUrl='+fileUrl)
  //       console.log(response.data.result)
  //     const res=await embeddDocument({
  //       splitText:response.data.result,
  //       fileId:'123'
  //      });
  //      console.log("res:",res);
  //     // await embeddDocument({});

  //     setLoading(false);
  //     setOpen(false)

  // };

  return (
    <div>
      <Dialog open={open}  onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full"
            onClick={() => setOpen(true) }
            disabled={isMaxFile == true}
          >
            Upload pdf file
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Pdf file</DialogTitle>
            <DialogDescription asChild>
              <div>
                <h2>Select file to upload</h2>
                <div className="flex mt-1 gap-2 p-3 rounded-md border-2 border-slate-400">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => OnFileSelect(e)}
                  />
                </div>
                <div className="mt-1">
                  <label htmlFor="">Add file name</label>
                  <Input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>
                <DialogFooter className="sm:justify-end gap-2 mt-1">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button onClick={onUpload} disabled={loading}>
                    {loading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadPdfDialog;

