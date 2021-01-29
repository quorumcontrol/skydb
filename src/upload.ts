import { AxiosResponse } from "axios";
import { SkyDb } from "./client";
import { defaultOptions, BaseCustomOptions, formatSkylink } from "./utils";
import FormData from 'form-data'

/**
 * Custom upload options.
 *
 * @property [portalFileFieldname="file"] - The file fieldname for uploading files on this portal.
 * @property [portalDirectoryfilefieldname="files[]"] - The file fieldname for uploading directories on this portal.
 * @property [customFilename] - The custom filename to use when uploading files.
 * @property [query] - Query parameters.
 */
export type CustomUploadOptions = BaseCustomOptions & {
    portalFileFieldname?: string;
    portalDirectoryFileFieldname?: string;
    customFilename?: string;
    query?: Record<string, unknown>;
  };
  
  /**
   * The response to an upload request.
   *
   * @property skylink - 46-character skylink.
   * @property merkleroot - The hash that is encoded into the skylink.
   * @property bitfield - The bitfield that gets encoded into the skylink. The bitfield contains a version, an offset and a length in a heavily compressed and optimized format.
   */
  export type UploadRequestResponse = {
    skylink: string;
    merkleroot: string;
    bitfield: number;
  };
  
  const defaultUploadOptions = {
    ...defaultOptions("/skynet/skyfile"),
    portalFileFieldname: "file",
    portalDirectoryFileFieldname: "files[]",
    customFilename: "",
  };

/**
 * Uploads a file to Skynet.
 *
 * @param this - SkynetClient
 * @param file - The file to upload.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @param [customOptions.endpointPath="/skynet/skyfile"] - The relative URL path of the portal endpoint to contact.
 * @returns - The returned skylink.
 * @throws - Will throw if the request is successful but the upload response does not contain a complete response.
 */
export async function uploadFile(
    this: SkyDb,
    bits: Buffer,
    customOptions?: CustomUploadOptions
  ): Promise<UploadRequestResponse> {
    const response = await uploadFileRequest(this, bits, customOptions);
  
    if (
      typeof response.data.skylink !== "string" ||
      typeof response.data.merkleroot !== "string" ||
      typeof response.data.bitfield !== "number"
    ) {
      throw new Error(
        "Did not get a complete upload response despite a successful request. Please try again and report this issue to the devs if it persists."
      );
    }
  
    const skylink = formatSkylink(response.data.skylink);
    const merkleroot = response.data.merkleroot;
    const bitfield = response.data.bitfield;
  
    return { skylink, merkleroot, bitfield };
  }


/**
 * Makes a request to upload a file to Skynet.
 *
 * @param this - SkynetClient
 * @param file - The file to upload.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @param [customOptions.endpointPath="/skynet/skyfile"] - The relative URL path of the portal endpoint to contact.
 * @returns - The upload response.
 */
export async function uploadFileRequest(
    cli: SkyDb,
    bits: Buffer,
    customOptions?: CustomUploadOptions
  ): Promise<AxiosResponse> {
    const opts = { ...defaultUploadOptions, ...cli.customOptions, ...customOptions };
    const formData = new FormData();
  
    if (opts.customFilename) {
      formData.append(opts.portalFileFieldname, bits, opts.customFilename);
    } else {
      formData.append(opts.portalFileFieldname, bits, 'default');
    }
  
    const response = await cli.executeRequest({
      ...opts,
      method: "post",
      data: formData,
    });
  
    return response;
  }
