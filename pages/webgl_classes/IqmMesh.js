/* IQM Mesh Class 
 * see https://github.com/lsalzman/iqm */

class IqmMesh extends Mesh {
    /**
        @brief IqmMesh constructor
        @param [gl] webgl context
        @param [dataArr] array of bytes of the iqm file
    */
    constructor(gl, dataArr) {
        var hdr = IqmMesh.GetHeader(dataArr);
        const IQM_MAGIC = "INTERQUAKEMODEL";
        const IQM_VERSION = 2;
        if (hdr.version != IQM_VERSION) {
            console.log("Header version != IQM_VERSION: ", hdr.version);
        }
        for (var i=0; i<IQM_MAGIC.length; ++i) {
            if (String.fromCharCode(hdr.magic[i]) != IQM_MAGIC[i]) {
                console.log("header magic != iqm magic: ", hdr.magic[i], IQM_MAGIC[i]);
                return;
            }
        }
        console.log("iqm magic and version match in header!");
        
        var meshData = IqmMesh.LoadMeshes(hdr, dataArr);
        
        var combinedVertices = [];
        for (var i=0; i<meshData.inpositions.length/3; ++i)
        {
            // position
            combinedVertices.push(meshData.inpositions[i*3 + 0]);
            combinedVertices.push(meshData.inpositions[i*3 + 1]);
            combinedVertices.push(meshData.inpositions[i*3 + 2]);
            // normal
            combinedVertices.push(meshData.innormals[i*3 + 0]);
            combinedVertices.push(meshData.innormals[i*3 + 1]);
            combinedVertices.push(meshData.innormals[i*3 + 2]);
            // texcoords
            combinedVertices.push(meshData.intexcoords[i*2 + 0]);
            combinedVertices.push(meshData.intexcoords[i*2 + 1]);
        }
        const elementsPerVertex = 8;
        super(gl, combinedVertices, elementsPerVertex, meshData.inindices);
        
        this.inpositions = meshData.inpositions;
        this.innormals = meshData.innormals;
        this.intexcoords = meshData.intexcoords;
        this.inblendindexes = meshData.inblendindexes;
        this.inblendweights = meshData.inblendweights;
        this.baseframes = meshData.baseframes;
        this.inversebaseframes = meshData.inversebaseframes;
        this.joints = meshData.joints;
        
        this.numFrames = hdr.num_frames;
        this.startFrame = 0;
        this.endFrame = this.numFrames - 1;
        
        this.numJoints = hdr.num_joints;
        
        this.outframes = [];
        for (var i=0; i<this.numJoints; ++i) {
            this.outframes.push(mat4.create());
        }
        
        this.numVerts = hdr.num_vertexes;
        // 8 = floats per vertex (position, normal, texcoord)
        this.outverts = new Float32Array(this.numVerts * 8);
        if (this.numVerts*8 != combinedVertices.length) {
            console.log("ERROR - num verts != combined verts length");
        }
        for (var i=0; i<this.numVerts * 8; ++i) {
            this.outverts[i] = combinedVertices[i];
        }
        
        var animData = this.LoadIqmAnims(dataArr, hdr);
        console.log("animData: ", animData);
        this.frames = animData.frames;
        
        this.material = new Material(
            [1.0, 1.0, 1.0], // ambient
            [1.0, 1.0, 1.0], // diffuse
            [0.5, 0.5, 0.5], // specular
            2 // shininess
        );
    }
    
    /**
        @brief updates vertex buffer data with pose blended between the current and next frame based on curframe
        @param [curframe] floating point value of the current frame out of the total number of animation frames
    */
    Animate(curframe) {
        var frame1 = Math.floor(curframe);
        var frame2 = frame1 + 1;
        var frameoffset = curframe - frame1;
        if (frame1 > this.endFrame) { frame1 = this.startFrame; frame2 = frame1 + 1; }
        if (frame2 > this.endFrame) { frame2 = this.startFrame; }
        
        var mat1Index = frame1 * this.numJoints;
        var mat2Index = frame2 * this.numJoints;
        
        var mat = mat4.create();
        var mat1 = mat4.create();
        var mat2 = mat4.create();
        var framepos = vec3.create();
        var framenorm = vec3.create();
        var inposition = vec3.create();
        var innormal = vec3.create();
        
        for (var i=0; i<this.numJoints; ++i) {
            mat4.multiplyScalar(
                mat1,
                this.frames[mat1Index + i],
                1.0 - frameoffset
            );
            mat4.multiplyScalar(
                mat2,
                this.frames[mat2Index + i],
                frameoffset
            );
            mat4.add(
                mat,
                mat1,
                mat2
            );
            
            if (this.joints[i].parent >= 0) {
                mat4.multiply(
                    this.outframes[i],
                    this.outframes[this.joints[i].parent],
                    mat
                );
            }
            else {
                mat4.copy(this.outframes[i], mat);
            }
        }
        
        var blendIndex = 0;
        for (var i=0; i<this.numVerts; ++i) {
            mat4.multiplyScalar(
                mat,
                this.outframes[this.inblendindexes[blendIndex + 0]],
                (1.0 * this.inblendweights[blendIndex + 0]) / 255.0
            );
            for (var j=1; j<4 && this.inblendweights[blendIndex + j]; ++j) {
                mat4.multiplyScalar(
                    mat1,
                    this.outframes[this.inblendindexes[blendIndex + j]],
                    (1.0 * this.inblendweights[blendIndex + j]) / 255.0
                );
                mat4.add(
                    mat,
                    mat,
                    mat1
                );
            }
            
            inposition[0] = this.inpositions[i*3 + 0];
            inposition[1] = this.inpositions[i*3 + 1];
            inposition[2] = this.inpositions[i*3 + 2];
            vec3.transformMat4(
                framepos,
                inposition,
                mat
            );
            
            // normal matrix
            mat4.invert(mat1, mat);
            mat4.transpose(mat1, mat1);
            
            innormal[0] = this.innormals[i*3 + 0];
            innormal[1] = this.innormals[i*3 + 1];
            innormal[2] = this.innormals[i*3 + 2];
            vec3.transformMat4(
                framenorm,
                innormal,
                mat1
            );
            
            // 8 = floats per vertex
            this.outverts[i*8 + 0] = framepos[0];
            this.outverts[i*8 + 1] = framepos[1];
            this.outverts[i*8 + 2] = framepos[2];
            this.outverts[i*8 + 3] = framenorm[0];
            this.outverts[i*8 + 4] = framenorm[1];
            this.outverts[i*8 + 5] = framenorm[2];
            // tex coords are the same
            
            blendIndex += 4;
        }
        
        // Mesh.js
        this.updateVertices(this.outverts);
    }
    
    /**
        @brief Returns the header struct from the input data array
    */
    static GetHeader(dataArr) {
        var hdr = {};
        
        var arrIndex = 0;
        const bytesPerUint = Uint32Array.BYTES_PER_ELEMENT;
        hdr.magic = dataArr.slice(0,16);
        arrIndex += 16;
        hdr.version = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.filesize = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.flags = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_text = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_text = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_meshes = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_meshes = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_vertexarrays = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_vertexes = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_vertexarrays = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_triangles = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_triangles = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_adjacency = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_joints = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_joints = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_poses = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_poses = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_anims = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_anims = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_frames = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_framechannels = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_frames = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_bounds = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_comment = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_comment = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.num_extensions = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        hdr.ofs_extensions = IqmMesh.BytesToUint32(dataArr.slice(arrIndex,  arrIndex+bytesPerUint)); arrIndex += bytesPerUint;
        
        return hdr;
    }
    
    static LoadMeshes(hdr, dataArr) {
        const iqmVertArraySize = Uint32Array.BYTES_PER_ELEMENT * 5; // type, flags, format, size, offset
        const iqmTriangleSize = Uint32Array.BYTES_PER_ELEMENT * 3;
        const iqmAdjacencySize = Uint32Array.BYTES_PER_ELEMENT * 3;
        const iqmJointSize =
            Uint32Array.BYTES_PER_ELEMENT + // name
            Int32Array.BYTES_PER_ELEMENT + // parent
            Float32Array.BYTES_PER_ELEMENT * 10; // translate, rotate, scale
        const iqmPoseSize =
            Int32Array.BYTES_PER_ELEMENT + // parent
            Uint32Array.BYTES_PER_ELEMENT + // mask
            Float32Array.BYTES_PER_ELEMENT * 10 + // channeloffset[10]
            Float32Array.BYTES_PER_ELEMENT * 10; // channelscale[10]
        const iqmMeshSize =
            Uint32Array.BYTES_PER_ELEMENT * 6; // name, material, first_vertex, num_vertexes, first_triangle, num_triangles
        var vertexArraysData = dataArr.slice(
            hdr.ofs_vertexarrays,
            hdr.ofs_vertexarrays + hdr.num_vertexarrays * iqmVertArraySize
        );
        var trianglesData = dataArr.slice(
            hdr.ofs_triangles,
            hdr.ofs_triangles + hdr.num_triangles * iqmTriangleSize
        );
        var meshesData = dataArr.slice(
            hdr.ofs_meshes,
            hdr.ofs_meshes + hdr.num_meshes * iqmMeshSize
        );
        var jointsData = dataArr.slice(
            hdr.ofs_joints,
            hdr.ofs_joints + hdr.num_joints * iqmJointSize
        );
        var adjacencyData = [];
        if (hdr.ofs_adjacency) {
            adjacencyData = dataArr.slice(
                hdr.ofs_adjacency,
                hdr.ofs_adjacency + hdr.num_triangles * iqmAdjacencySize
            );
        }
        
        var vertexArrays = IqmMesh.GetVertexArrays(vertexArraysData, hdr.num_vertexarrays);
        var triangles = IqmMesh.GetTriangles(trianglesData, hdr.num_triangles);
        var meshes = IqmMesh.GetMeshes(meshesData, hdr.num_meshes);
        var joints = IqmMesh.GetJoints(jointsData, hdr.num_joints);
        //console.log("vertex arrays: ", vertexArrays);
        
        var inpositions = [];
        var innormals = [];
        var intangents = [];
        var intexcoords = [];
        var inblendindexes = [];
        var inblendweights = [];
        var inindices = [];
        // var incolors = [];
        
        const IQM_POSITION = 0;
        const IQM_NORMAL = 2;
        const IQM_TANGENT = 3;
        const IQM_TEXCOORD = 1;
        const IQM_BLENDINDEXES = 4;
        const IQM_BLENDWEIGHTS = 5;
        const IQM_COLOR = 6;
        
        const IQM_UBYTE = 1;
        const IQM_FLOAT = 7;
        
        for (var i=0; i<vertexArrays.length; ++i)
        {
            var va = vertexArrays[i];
            switch (va.type)
            {
            case IQM_POSITION:
                if (va.format != IQM_FLOAT || va.size != 3) {
                    console.log("ERROR - invalid va format or size for IQM_POSITION\n");
                    return;
                }
                for (var j=0, index=va.offset; j<3*hdr.num_vertexes; ++j, index+=Float32Array.BYTES_PER_ELEMENT) {
                    inpositions.push(IqmMesh.BytesToFloat32(
                        dataArr.slice(index, index+Float32Array.BYTES_PER_ELEMENT)
                    ));
                }
                break;
            case IQM_NORMAL:
                if (va.format != IQM_FLOAT || va.size != 3) {
                    console.log("ERROR - invalid va format or size for IQM_NORMAL\n");
                    return;
                }
                for (var j=0, index=va.offset; j<3*hdr.num_vertexes; ++j, index+=Float32Array.BYTES_PER_ELEMENT) {
                    innormals.push(IqmMesh.BytesToFloat32(
                        dataArr.slice(index, index+Float32Array.BYTES_PER_ELEMENT)
                    ));
                }
                break;
            case IQM_TANGENT:
                if (va.format != IQM_FLOAT || va.size != 4) {
                    console.log("ERROR - invalid va format or size for IQM_TANGENT\n");
                    return;
                }
                for (var j=0, index=va.offset; j<4*hdr.num_vertexes; ++j, index+=Float32Array.BYTES_PER_ELEMENT) {
                    intangents.push(IqmMesh.BytesToFloat32(
                        dataArr.slice(index, index+Float32Array.BYTES_PER_ELEMENT)
                    ));
                }
                break;
            case IQM_TEXCOORD:
                if (va.format != IQM_FLOAT || va.size != 2) {
                    console.log("ERROR - invalid va format or size for IQM_TEXCOORD\n");
                    return;
                }
                for (var j=0, index=va.offset; j<2*hdr.num_vertexes; ++j, index+=Float32Array.BYTES_PER_ELEMENT) {
                    intexcoords.push(IqmMesh.BytesToFloat32(
                        dataArr.slice(index, index+Float32Array.BYTES_PER_ELEMENT)
                    ));
                }
                break;
            case IQM_BLENDINDEXES:
                if (va.format != IQM_UBYTE || va.size != 4) {
                    console.log("ERROR - invalid va format or size for IQM_BLENDINDEXES");
                    return;
                }
                for (var j=0, index=va.offset; j<4*hdr.num_vertexes; ++j, ++index) {
                    inblendindexes.push(dataArr[index]);
                }
                break;
            case IQM_BLENDWEIGHTS:
                if (va.format != IQM_UBYTE || va.size != 4) {
                    console.log("ERROR - invalid va format or size for IQM_BLENDINDEXES");
                    return;
                }
                for (var j=0, index=va.offset; j<4*hdr.num_vertexes; ++j, ++index) {
                    inblendweights.push(dataArr[index]);
                }
                break;
            case IQM_COLOR:
                // TODO
                // not used currently
                break;
            default:
                console.log("ERROR - unhandled iqm vertex array type");
                break;
            }
        }
        
        //console.log("inpositions: ", inpositions);
        //console.log("innormals: ", innormals);
        //console.log("intangents: ", intangents);
        //console.log("intexcoords: ", intexcoords);
        //console.log("inblendindexes: ", inblendindexes);
        //console.log("inblendweights: ", inblendweights);
        
        var baseframes = [];
        var inversebaseframes = [];
        for (var i=0; i<hdr.num_joints; ++i) {
            baseframes.push(mat4.create());
            mat4.identity(baseframes[baseframes.length-1]);
            
            inversebaseframes.push(mat4.create());
            mat4.identity(inversebaseframes[inversebaseframes.length-1]);
        }
        
        for (var i=0; i<hdr.num_joints; ++i) {
            var j = joints[i];
            var rot = quat.fromValues(
                // x, y, z, w
                j.rotate[0], j.rotate[1], j.rotate[2], j.rotate[3]
            );
            quat.normalize(rot, rot);
            baseframes[i] = mat4.create();
            mat4.identity(baseframes[i]);
            mat4.scale(
                baseframes[i],
                baseframes[i],
                vec3.fromValues(j.scale[0], j.scale[1], j.scale[2])
            );
            var rotTrans = mat4.create();
            // scale, then rotate, then translate
            mat4.fromRotationTranslation(
                rotTrans,
                rot,
                vec3.fromValues(j.translate[0], j.translate[1], j.translate[2]),
            );
            mat4.multiply(
                baseframes[i],
                rotTrans,
                baseframes[i]
            );
            
            mat4.invert(inversebaseframes[i], baseframes[i]);
            
            if (j.parent >= 0) {
                mat4.multiply(baseframes[i], baseframes[j.parent], baseframes[i]);
                mat4.multiply(inversebaseframes[i], inversebaseframes[i], inversebaseframes[j.parent]);
            }
        }
        
        //console.log("hdr num meshes: ", hdr.num_meshes);
        var mesh = meshes[0];
        for (var i=0; i<mesh.num_triangles; ++i)
        {
            inindices.push(triangles[mesh.first_triangle + i].vertex[0]);
            inindices.push(triangles[mesh.first_triangle + i].vertex[1]);
            inindices.push(triangles[mesh.first_triangle + i].vertex[2]);
        }
        
        // debug
        //for (var i=0; i<baseframes.length; ++i) {
        //    console.log("baseframe " + i + ":", baseframes[i]);
        //    console.log("inversebaseframe " + i + ":", inversebaseframes[i]);
        //}
        
        return {
            inpositions: inpositions,
            innormals: innormals,
            intangents: intangents,
            intexcoords: intexcoords,
            inblendindexes: inblendindexes,
            inblendweights: inblendweights,
            inindices: inindices,
            baseframes: baseframes,
            inversebaseframes: inversebaseframes,
            joints: joints
        };
    }
    
    LoadIqmAnims(dataArr, hdr) {
        //console.log("Load Iqm Anims dataArr length: ", dataArr.length);
        const iqmPoseSize =
            Int32Array.BYTES_PER_ELEMENT + // parent
            Uint32Array.BYTES_PER_ELEMENT + // bask
            Float32Array.BYTES_PER_ELEMENT * 10 + // channeloffset
            Float32Array.BYTES_PER_ELEMENT * 10; // channelscale
        const iqmAnimSize =
            Uint32Array.BYTES_PER_ELEMENT * 3 + // name, first_frame, num_frames
            Float32Array.BYTES_PER_ELEMENT + // framerate
            Uint32Array.BYTES_PER_ELEMENT; // flags
        const iqmBoundsSize =
            Float32Array.BYTES_PER_ELEMENT * 8; // bbin[3], bbmax[3], xyradius, radius
        
        var posesData = dataArr.slice(
            hdr.ofs_poses,
            hdr.ofs_poses + hdr.num_poses * iqmPoseSize
        );
        var animsData = dataArr.slice(
            hdr.ofs_anims,
            hdr.ofs_anims + hdr.num_anims * iqmAnimSize
        );
        var framesData = dataArr.slice(
            hdr.ofs_frames,
            hdr.ofs_frame + hdr.num_frames*hdr.num_framechannels
        );
        var ofsBoundsData = [];
        if (hdr.ofs_bounds) {
            ofsBoundsData = dataArr.slice(
                hdr.ofs_bounds,
                hdr.ofs_bound + hdr.num_frames * iqmBoundsSize
            );
        }
        
        var anims = IqmMesh.GetAnims(animsData, hdr.num_anims);
        var poses = IqmMesh.GetPoses(posesData, hdr.num_poses);
        var frames = [];
        for (var i=0; i<hdr.num_frames*hdr.num_poses; ++i) {
            frames.push(mat4.create());
            mat4.identity(frames[frames.length-1]);
        }
        
        var framedata = [];
        var frameDataIndex = hdr.ofs_frames;
        // 10 = translate.xyz, rotate.xyzw, scale.xyz
        for (var i=0; i<hdr.num_frames*hdr.num_poses*10 && frameDataIndex < dataArr.length; ++i) {
            framedata.push(IqmMesh.BytesToUint16(
                dataArr.slice(frameDataIndex, frameDataIndex+Uint16Array.BYTES_PER_ELEMENT)
            ));
            frameDataIndex += Uint16Array.BYTES_PER_ELEMENT;
        }
        
        // TODO - bounds
        // if (hdr.ofs_bounds) bounds = (iqmbounds*)&buf[hdr.ofs_bounds]
        
        var frameIndex = 0;
        for (var i=0; i<hdr.num_frames; ++i)
        {
            for (var j=0; j < hdr.num_poses; ++j)
            {
                var p = poses[j];
                
                var tx = p.channeloffset[0];
                var ty = p.channeloffset[1];
                var tz = p.channeloffset[2];
                if (p.mask&0x01) {
                    tx += framedata[frameIndex] * p.channelscale[0];
                    ++frameIndex;
                }
                if (p.mask&0x02) {
                    ty += framedata[frameIndex] * p.channelscale[1];
                    ++frameIndex;
                }
                if (p.mask&0x04) {
                    tz += framedata[frameIndex] * p.channelscale[2];
                    ++frameIndex;
                }
                var translate = vec3.fromValues(tx, ty, tz);
                
                var rx = p.channeloffset[3];
                var ry = p.channeloffset[4];
                var rz = p.channeloffset[5];
                var rw = p.channeloffset[6];
                if (p.mask&0x08) {
                    rx += framedata[frameIndex] * p.channelscale[3];
                    ++frameIndex;
                }
                if (p.mask&0x10) {
                    ry += framedata[frameIndex] * p.channelscale[4];
                    ++frameIndex;
                }
                if (p.mask&0x20) {
                    rz += framedata[frameIndex] * p.channelscale[5];
                    ++frameIndex;
                }
                if (p.mask&0x40) {
                    rw += framedata[frameIndex] * p.channelscale[6];
                    ++frameIndex;
                }
                var rotate = quat.fromValues(rx, ry, rz, rw);
                quat.normalize(rotate, rotate);
                
                var sx = p.channeloffset[7];
                var sy = p.channeloffset[8];
                var sz = p.channeloffset[9];
                if (p.mask&0x80) {
                    sx += framedata[frameIndex] * p.channelscale[7];
                    ++frameIndex;
                }
                if (p.mask&0x100) {
                    sy += framedata[frameIndex] * p.channelscale[8];
                    ++frameIndex;
                }
                if (p.mask&0x200) {
                    sz += framedata[frameIndex] * p.channelscale[9];
                    ++frameIndex;
                }                
                var scale = vec3.fromValues(sx, sy, sz);
                
                var m = mat4.create();
                mat4.identity(m);
                mat4.scale(m, m, scale);
                var rotTrans = mat4.create();
                mat4.fromRotationTranslation(rotTrans, rotate, translate);
                mat4.multiply(m, rotTrans, m);
                
                if (p.parent >= 0) {
                    mat4.multiply(
                        frames[i*hdr.num_poses + j],
                        m,
                        this.inversebaseframes[j]
                    );
                    mat4.multiply(
                        frames[i*hdr.num_poses + j],
                        this.baseframes[p.parent],
                        frames[i*hdr.num_poses + j]
                    );
                }
                else {
                    mat4.multiply(
                        frames[i*hdr.num_poses + j],
                        m,
                        this.inversebaseframes[j]
                    );
                }
            }
        }
        
        return {
            frames: frames
        };
    }
    
    static BytesToUint32(bytes) {
        if (bytes.length != Uint32Array.BYTES_PER_ELEMENT) {
            console.log("BytesToUint32 len != 4: ", bytes.length);
            return 0;
        }
        var buf = new Uint8Array(bytes);
        var u32buf = new Uint32Array(buf.buffer);
        return u32buf[0];
    }
    static BytesToInt32(bytes) {
        if (bytes.length != Int32Array.BYTES_PER_ELEMENT) {
            console.log("BytesToInt32 len != 4: ", bytes.length);
            return 0;
        }
        var buf = new Uint8Array(bytes);
        var i32buf = new Int32Array(buf.buffer);
        return i32buf[0];
    }
    static BytesToUint16(bytes) {
        if (bytes.length != Uint16Array.BYTES_PER_ELEMENT) {
            console.log("BytesToUint16 len != 2: ", bytes.length);
            return 0;
        }
        var buf = new Uint8Array(bytes);
        var u16buf = new Uint16Array(buf.buffer);
        return u16buf[0];
    }
    static BytesToFloat32(bytes) {
        if (bytes.length != Float32Array.BYTES_PER_ELEMENT) {
            console.log("BytesToFloat32 len != 4: ", bytes.length);
            return 0.0;
        }
        var buf = new Uint8Array(bytes);
        var f32buf = new Float32Array(buf.buffer);
        return f32buf[0];
    }
    
    static GetVertexArrays(vertexArrsData, numVertexArrs) {
        var vertexArrs = [];
        var index = 0;
        const bytesPerElem = Uint32Array.BYTES_PER_ELEMENT;
        for (var i=0; i<numVertexArrs; ++i) {
            vertexArrs.push({
                type:   this.BytesToUint32(vertexArrsData.slice(index + bytesPerElem*0, index + bytesPerElem*0 + bytesPerElem)),
                flags:  this.BytesToUint32(vertexArrsData.slice(index + bytesPerElem*1, index + bytesPerElem*1 + bytesPerElem)),
                format: this.BytesToUint32(vertexArrsData.slice(index + bytesPerElem*2, index + bytesPerElem*2 + bytesPerElem)),
                size:   this.BytesToUint32(vertexArrsData.slice(index + bytesPerElem*3, index + bytesPerElem*3 + bytesPerElem)),
                offset: this.BytesToUint32(vertexArrsData.slice(index + bytesPerElem*4, index + bytesPerElem*4 + bytesPerElem))
            });
            index += bytesPerElem * 5;
        }
        return vertexArrs;
    }
    
    static GetTriangles(trianglesData, numTriangles) {
        var triangles = [];
        var index = 0;
        const bytesPerElem = Uint32Array.BYTES_PER_ELEMENT;
        for (var i=0; i<numTriangles; ++i) {
            triangles.push({
                vertex: [
                    this.BytesToUint32(trianglesData.slice(index + bytesPerElem*0, index + bytesPerElem*0 + bytesPerElem)),
                    this.BytesToUint32(trianglesData.slice(index + bytesPerElem*1, index + bytesPerElem*1 + bytesPerElem)),
                    this.BytesToUint32(trianglesData.slice(index + bytesPerElem*2, index + bytesPerElem*2 + bytesPerElem))
                ]
            });
            index += bytesPerElem * 3;
        }
        return triangles;
    }
    
    static GetMeshes(meshesData, numMeshes) {
        var meshes = [];
        var index = 0;
        const bytesPerElem = Uint32Array.BYTES_PER_ELEMENT;
        for (var i=0; i<numMeshes; ++i) {
            meshes.push({
                name:           this.BytesToUint32(meshesData.slice(index + bytesPerElem*0, index + bytesPerElem*0 + bytesPerElem)),
                material:       this.BytesToUint32(meshesData.slice(index + bytesPerElem*1, index + bytesPerElem*1 + bytesPerElem)),
                first_vertex:   this.BytesToUint32(meshesData.slice(index + bytesPerElem*2, index + bytesPerElem*2 + bytesPerElem)),
                num_vertexes:   this.BytesToUint32(meshesData.slice(index + bytesPerElem*3, index + bytesPerElem*3 + bytesPerElem)),
                first_triangle: this.BytesToUint32(meshesData.slice(index + bytesPerElem*4, index + bytesPerElem*4 + bytesPerElem)),
                num_triangles:  this.BytesToUint32(meshesData.slice(index + bytesPerElem*5, index + bytesPerElem*5 + bytesPerElem))
            });
            index += bytesPerElem * 6;
        }
        return meshes;
    }
    
    static GetJoints(jointsData, numJoints) {
        var joints = [];
        var index = 0;
        for (var i=0; i<numJoints; ++i) {
            var joint = {};
            
            joint.name = IqmMesh.BytesToUint32(jointsData.slice(index, index + Uint32Array.BYTES_PER_ELEMENT));
            index += Uint32Array.BYTES_PER_ELEMENT;
            
            joint.parent = IqmMesh.BytesToInt32(jointsData.slice(index, index + Int32Array.BYTES_PER_ELEMENT));
            index += Int32Array.BYTES_PER_ELEMENT;
            
            joint.translate = [
                IqmMesh.BytesToFloat32(jointsData.slice(index, index + Float32Array.BYTES_PER_ELEMENT)),
                IqmMesh.BytesToFloat32(jointsData.slice(index + Float32Array.BYTES_PER_ELEMENT*1, index + Float32Array.BYTES_PER_ELEMENT*1 + Float32Array.BYTES_PER_ELEMENT)),
                IqmMesh.BytesToFloat32(jointsData.slice(index + Float32Array.BYTES_PER_ELEMENT*2, index + Float32Array.BYTES_PER_ELEMENT*2 + Float32Array.BYTES_PER_ELEMENT))
            ];
            index += Float32Array.BYTES_PER_ELEMENT * 3;
            
            joint.rotate = [
                IqmMesh.BytesToFloat32(jointsData.slice(index, index + Float32Array.BYTES_PER_ELEMENT)),
                IqmMesh.BytesToFloat32(jointsData.slice(index + Float32Array.BYTES_PER_ELEMENT*1, index + Float32Array.BYTES_PER_ELEMENT*1 + Float32Array.BYTES_PER_ELEMENT)),
                IqmMesh.BytesToFloat32(jointsData.slice(index + Float32Array.BYTES_PER_ELEMENT*2, index + Float32Array.BYTES_PER_ELEMENT*2 + Float32Array.BYTES_PER_ELEMENT)),
                IqmMesh.BytesToFloat32(jointsData.slice(index + Float32Array.BYTES_PER_ELEMENT*3, index + Float32Array.BYTES_PER_ELEMENT*3 + Float32Array.BYTES_PER_ELEMENT))
            ];
            index += Float32Array.BYTES_PER_ELEMENT * 4;
            
            joint.scale = [
                IqmMesh.BytesToFloat32(jointsData.slice(index, index + Float32Array.BYTES_PER_ELEMENT)),
                IqmMesh.BytesToFloat32(jointsData.slice(index + Float32Array.BYTES_PER_ELEMENT*1, index + Float32Array.BYTES_PER_ELEMENT*1 + Float32Array.BYTES_PER_ELEMENT)),
                IqmMesh.BytesToFloat32(jointsData.slice(index + Float32Array.BYTES_PER_ELEMENT*2, index + Float32Array.BYTES_PER_ELEMENT*2 + Float32Array.BYTES_PER_ELEMENT))
            ];
            index += Float32Array.BYTES_PER_ELEMENT * 3;
            
            joints.push(joint);
        }
        return joints;
    }
    
    static GetAnims(animsData, numAnims) {
        var anims = [];
        var index = 0;
        for (var i=0; i<numAnims; ++i) {
            var anim = {};
            
            anim.name = IqmMesh.BytesToUint32(animsData.slice(index, index+Uint32Array.BYTES_PER_ELEMENT));
            index += Uint32Array.BYTES_PER_ELEMENT;
            
            anim.first_frame = IqmMesh.BytesToUint32(animsData.slice(index, index+Uint32Array.BYTES_PER_ELEMENT));
            index += Uint32Array.BYTES_PER_ELEMENT;
            
            anim.num_frames = IqmMesh.BytesToUint32(animsData.slice(index, index+Uint32Array.BYTES_PER_ELEMENT));
            index += Uint32Array.BYTES_PER_ELEMENT;
            
            anim.framerate = IqmMesh.BytesToFloat32(animsData.slice(index, index+Float32Array.BYTES_PER_ELEMENT));
            index += Float32Array.BYTES_PER_ELEMENT;
            
            anim.flags = IqmMesh.BytesToUint32(animsData.slice(index, index+Uint32Array.BYTES_PER_ELEMENT));
            index += Uint32Array.BYTES_PER_ELEMENT;
            
            anims.push(anim);
        }
        
        return anims;
    }
    
    static GetPoses(posesData, numPoses) {
        var poses = [];
        var index = 0;
        for (var i=0; i<numPoses; ++i) {
            var pose = {};
            
            pose.parent = IqmMesh.BytesToInt32(posesData.slice(index, index+Int32Array.BYTES_PER_ELEMENT));
            index += Int32Array.BYTES_PER_ELEMENT;
            
            pose.mask = IqmMesh.BytesToUint32(posesData.slice(index, index+Uint32Array.BYTES_PER_ELEMENT));
            index += Uint32Array.BYTES_PER_ELEMENT;
            
            pose.channeloffset = [];
            for (var j=0; j<10; ++j) {
                pose.channeloffset.push(
                    IqmMesh.BytesToFloat32(posesData.slice(index, index+Float32Array.BYTES_PER_ELEMENT))
                );
                index += Float32Array.BYTES_PER_ELEMENT;
            }
            
            pose.channelscale = [];
            for (var j=0; j<10; ++j) {
                pose.channelscale.push(
                    IqmMesh.BytesToFloat32(posesData.slice(index, index+Float32Array.BYTES_PER_ELEMENT))
                );
                index += Float32Array.BYTES_PER_ELEMENT;
            }
            
            poses.push(pose);
        }
        
        return poses;
    }
};
