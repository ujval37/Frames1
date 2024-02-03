import {
  FrameContainer,
  FrameImage,
  FrameButton,
  FrameReducer,
  useFramesReducer,
  createFrameContextNextjs,
  validateFrameMessageOrThrow,
  FrameInput,
} from "frames.js/next/server";

type State = {
  active: string;
};

const initialState = { active: "1" };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    active: action.frame_action_received?.untrustedData.buttonIndex
      ? String(action.frame_action_received?.untrustedData.buttonIndex)
      : "1",
  };
};

// This is a react server component only
export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const frameContext = createFrameContextNextjs<State>(searchParams);
  await validateFrameMessageOrThrow(frameContext.frame_action_received);
  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    frameContext
  );

  // Here: do a server side side effect either sync or async (using await), such as minting an NFT if you want.
  // example: load the users credentials & check they have an NFT

  // then, when done, return next frame
  return (
    <div>
      Frames-jsx example
      <FrameContainer postRoute="http://localhost:3000/frames" state={state}>
        <FrameImage src="https://picsum.photos/seed/frames.js/1146/600" />
        <FrameInput text="put some text here" />
        <FrameButton onClick={dispatch}>
          {state?.active === "1" ? "Active" : "Inactive"}
        </FrameButton>
        <FrameButton onClick={dispatch}>
          {state?.active === "2" ? "Active" : "Inactive"}
        </FrameButton>
        <FrameButton href={`http://localhost:3000/`}>Page link</FrameButton>
        <FrameButton href={`https://www.google.com`}>External link</FrameButton>
      </FrameContainer>
    </div>
  );
}