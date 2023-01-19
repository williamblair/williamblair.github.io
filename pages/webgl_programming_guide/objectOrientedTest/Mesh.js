class Mesh
{
    constructor()
    {
        this.positions = [];
        this.normals = [];
        this.texCoords = [];
        this.weights = [];
        this.influences = [];
        this.indices = [];
        
        this.posAttrib = null;
        this.normAttrib = null;
        this.uvAttrib = null;
        this.weightAttrib = null;
        this.influenceAttrib = null;
        this.indexBuffer = null;
        
        this.skinnedPositions = [];
        this.skinnedNormals = [];
        this.posePalette = [];
    }
    
    CPUSkin(skeleton, pose)
    {
        const numVerts = this.positions.length;
        if (numVerts === 0) {
            // TODO error
            return;
        }
        
        // resize to match numVerts
        while (this.skinnedPositions.length > numVerts) this.skinnedPositions.pop();
        while (this.skinnedPositions.length < numVerts) this.skinnedPositions.push(new Vector3());
        while (this.skinnedNormals.length > numVerts) this.skinnedNormals.pop();
        while (this.skinnedNormals.length < numVerts) this.skinnedNormals.push(new Vector3());
        
        pose.GetMatrixPalette(this.posePalette);
        var invPosePalette = skeleton.GetInvBindPose();
        
        for (var i = 0; i < numVerts; ++i) {
            var joint = this.influences[i];
            var weight = this.weights[i];
            
            // calculate the skin matrix
            // up to 4 different joint influences (not all necessarily used)
            var m0 = new Matrix4().set(this.posePalette[joint.elements[0]]).multiply(invPosePalette[joint.elements[0]])).multiplySclar(weight.elements[0]); // first joint influence
            var m1 = new Matrix4().set(this.posePalette[joint.elements[1]]).multiply(invPosePalette[joint.elements[1]])).multiplyScalar(weight.elements[1]); // second joint influence
            var m2 = new Matrix4().set(this.posePalette[joint.elements[2]]).multiply(invPosePalette[joint.elements[2]])).multiplyScalar(weight.elements[2]); // third joint influence
            var m3 = new Matrix4().set(this.posePalette[joint.elements[3]]).multiply(invPosePalette[joint.elements[3]])).multiplyScalar(weight.elements[3]); // fourth joint influence
            var skin = m0.add(m1).add(m2).add(m3);
            
            // combine transforms
            skinnedPositions[i] = skin.multiplyVector3(positions[i]);
            skinnedNormals[i] = skin.multiplyVector3(normals[i]);
        }
    }
    
    CPUSkin(animatedPose)
    {
        const numVerts = this.positions.length;
        if (numVerts === 0) {
            return;
        }
        
        // resize to match numVerts
        while (this.skinnedPositions.length > numVerts) this.skinnedPositions.pop();
        while (this.skinnedPositions.length < numVerts) this.skinnedPositions.push(new Vector3());
        while (this.skinnedNormals.length > numVerts) this.skinnedNormals.pop();
        while (this.skinnedNormals.length < numVerts) this.skinnedNormals.push(new Vector3());
        
        for (var i = 0; i < numVerts; ++i) {
            var joint = this.influences[i];
            var weight = this.weights[i];
            
            var p0 = animatedPose[joint.elements[0]].multiplyVector3(this.positions[i]).multiplyScalar(weight.elements[0]);
            var p1 = animatedPose[joint.elements[1]].multiplyVector3(this.positions[i]).multiplyScalar(weight.elements[1]);
            var p2 = animatedPose[joint.elements[2]].multiplyVector3(this.positions[i]).multiplyScalar(weight.elements[2]);
            var p3 = animatedPose[joint.elements[3]].multiplyVector3(this.positions[i]).multiplyScalar(weight.elements[3]);
            this.skinnedPositions[i] = new Vector3([0,0,0]).add(p0).add(p1).add(p2).add(p3);
            
            var n0 = animatedPose[joint.elements[0]].multiplyVector3(this.normals[i]).multiplyScalar(weight.elements[0]);
            var n1 = animatedPose[joint.elements[1]].multiplyVector3(this.normals[i]).multiplyScalar(weight.elements[1]);
            var n2 = animatedPose[joint.elements[2]].multiplyVector3(this.normals[i]).multiplyScalar(weight.elements[2]);
            var n3 = animatedPose[joint.elements[3]].multiplyVector3(this.normals[i]).multiplyScalar(weight.elements[3]);
            this.skinnedNormals[i] = new Vector3([0,0,0]).add(n0).add(n1).add(n2).add(n3);
        }
        
        this.posAttrib.Set(this.skinnedPositions);
        this.posAttrib.Set(this.skinnedNormals);
    }
    
    UpdateOpenGLBuffers()
    {
        if (this.positions.length > 0) {
            this.posAttrib.Set(this.positions);
        }
        if (this.normals.length > 0) {
            this.normAttrib.Set(this.normals);
        }
        if (this.texCoords.length > 0) {
            this.uvAttrib.Set(this.texCoords);
        }
        if (this.weights.length > 0) {
            this.weightAttrib.Set(this.weights);
        }
        if (this.positions.length > 0) {
            this.influenceAttrib.Set(this.influences);
        }
        if (this.positions.length > 0) {
            this.indexBuffer.Set(this.indices);
        }
    }
    
    // inputs are attribute locations
    Bind(position, normal, texCoord, weight, influence)
    {
        if (position >= 0) {
            this.posAttrib.BindTo(position);
        }
        if (normal >= 0) {
            this.normalAttrib.BindTo(normal);
        }
        if (texCoord >= 0) {
            this.uvAttrib.BindTo(texCoord);
        }
        if (weight >= 0) {
            this.weightAttrib.BindTo(weight);
        }
        if (influence >= 0) {
            this.influenceAttrib.BindTo(influence);
        }
    }
    
    Draw()
    {
        // TODO
        //if (indices.size() > 0) {
        //    ::Draw(*indexBuffer, DrawMode::Triangles);
        //} else {
        //    ::Draw(positions.size(), DrawMode::Triangles);
        //}
    }
    
    DrawInstanced(numInstances)
    {
        // TODO
        //if (indices.size() > 0) {
        //    ::DrawInstanced(*indexBuffer, DrawMode::Triangles, numInstances);
        //} else {
        //    ::DrawInstanced(positions.size(), DrawMode::Triangles, numInstances);
        //}
    }
    
    Unbind(position, normal, texCoord, weight, influence)
    {
        // TODO
    }
}