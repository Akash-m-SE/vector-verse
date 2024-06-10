import React from "react";

const PdfViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  return (
    <>
      <div className="w-full h-full">
        <iframe
          src={pdfUrl}
          height={"100%"}
          width={"100%"}
          className="w-full h-full"
        />
      </div>
    </>
  );
};

export default PdfViewer;
