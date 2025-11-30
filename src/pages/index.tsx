import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import tw from "twin.macro";
import { Field, Label } from "../components/Field";
import { Layout } from "../components/Layout";
import { Link } from "../components/Link";
import { Select } from "../components/Select";
import { OG_HEIGHT, OG_WIDTH } from "../constants";
import { useConfig } from "../hooks/useConfig";
import { useCopy } from "../hooks/useCopy";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useImageUrl } from "../hooks/useImageUrls";
import { useIsMounted } from "../hooks/useIsMounted";
import { layouts } from "../layouts";

const Home: NextPage = () => {
  const isMounted = useIsMounted();

  return (
    <main tw="px-6 pb-20 max-w-6xl w-full mx-auto">
      <header tw="text-center mt-20 mb-10 space-y-6">
        <h1 tw="text-5xl font-bold">Rafflex OG Image Generator</h1>
        <h2 tw="text-xl text-gray-600">Dynamic open graph images service</h2>
      </header>

      {/* We pull the state from local storage so need the app to be loaded in the browser */}
      {isMounted && (
        <>
          <Viewer />
          <Config />
        </>
      )}


    </main>
  );
};

const H2 = tw.h2`font-bold text-3xl mb-4`;
const P = tw.p`mb-4 max-w-lg leading-relaxed`;

const StyledLink = tw(Link)`
  underline text-accent hover:bg-accent hover:text-white hover:no-underline
`;

export default Home;

export const Config: React.FC = () => {
  const [{ layoutName }, setConfig] = useConfig();
  const [isSVGCopied, copySVG] = useCopy();
  const [isPNGCopied, copyPNG] = useCopy();

  const svgImageUrl = useImageUrl("svg");
  const pngImageUrl = useImageUrl("png");

  const layout = useMemo(
    () => layouts.find(l => l.name === layoutName),
    [layoutName],
  );

  return (
    <div tw="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4 md:mt-8">
      <div tw="space-y-4">
        <Field>
          <Label>Layout</Label>
          <Select
            value={layoutName}
            options={layouts.map(l => ({ value: l.name }))}
            onChange={layoutName => setConfig(c => ({ ...c, layoutName }))}
          />
        </Field>

        <hr />

        {layout == null ? (
          <p>Layout {layoutName} does not exist</p>
        ) : (
          <Layout layout={layout} key={layout.name} />
        )}
      </div>

      <div tw="space-y-6">
        <div className="buttons" tw="flex space-x-2 justify-end">
          <button
            css={[buttonStyles]}
            onClick={() => copySVG(`${window.location.origin}${svgImageUrl}`)}
          >
            {isSVGCopied ? "Copied!" : "Copy SVG Url"}
          </button>
          <button
            css={[buttonStyles]}
            onClick={() => copyPNG(`${window.location.origin}${pngImageUrl}`)}
          >
            {isPNGCopied ? "Copied!" : "Copy PNG Url"}
          </button>
        </div>

        <p
          tw="bg-gray-100 p-4 rounded font-mono whitespace-normal break-words text-sm"
          style={{ wordBreak: "break-all" }}
        >
          <Link href={svgImageUrl} target="_blank" tw="hover:text-pink-600">
            {svgImageUrl.replace("fileType=svg&", "")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export const Viewer: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(true);
  const svgImageUrl = useImageUrl("svg");

  const debouncedImageURL = useDebouncedValue(svgImageUrl, 200);
  useEffect(() => setIsLoaded(false), [debouncedImageURL]);

  return (
    <section tw="space-y-4 w-full">
      <div
        className="image-wrapper"
        css={[
          tw`w-full relative shadow-lg`,
          { paddingTop: `${(OG_HEIGHT / OG_WIDTH) * 100}%` },
        ]}
      >
        <img
          css={[
            tw`absolute inset-0 w-full`,
            !isLoaded && {
              filter: "blur(5px)",
            },
          ]}
          src={debouncedImageURL}
          alt={`Dynamically generated OG image`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </section>
  );
};

const buttonStyles = tw`
  flex items-center justify-center
  px-2 py-1 w-32 h-8 rounded text-sm text-gray-600 bg-gray-100 font-medium
  hover:bg-pink-100
  focus:outline-none focus:ring-2 focus:ring-pink-500
`;
