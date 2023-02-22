import React from "react";
import { useEnsAvatar } from "wagmi";
import Blockies from "react-blockies";

export default function Avatar(props: any) {
  const {
    data: avatarSrc,
    isError: avatarError,
    isLoading: avatarLoading,
  } = useEnsAvatar({
    address: props.wallet ? `0x${props.wallet.slice(2)}` : undefined,
  });
  const [imgError, setImgError] = React.useState(false);
  return (
    <>
      {avatarLoading ||
      avatarError ||
      [undefined, "", null].includes(avatarSrc) ||
      imgError ? (
        <div className="flex items-center overflow-auto rounded-xl">
          <Blockies
            seed={(props.wallet as string).toLowerCase()}
            scale={11}
            size={8}
          />
        </div>
      ) : (
        <img
          src={avatarSrc as string}
          onError={() => setImgError(true)}
          className="w-24 h-24 rounded-xl"
        />
      )}
    </>
  );
}
