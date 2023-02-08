/* Positional Light */
class PositionLight {
    /**
        @brief PositionLight constructor
        @param [position] vec3 of world space position
        @param [ambient] vec3 of ambient color
        @param [diffuse] vec3 of diffuse color
        @param [specular] vec3 of specular color
    */
    constructor(position, ambient, diffuse, specular) {
        this.position = vec3.fromValues(position[0], position[1], position[2]);
        this.ambient = vec3.fromValues(ambient[0], ambient[1], ambient[2]);
        this.diffuse = vec3.fromValues(diffuse[0], diffuse[1], diffuse[2]);
        this.specular = vec3.fromValues(specular[0], specular[1], specular[2]);
    }

    /**
        @brief set input shader uniforms of light values
    */
    SetUniforms(shader) {
        shader.SetVec3Uniform(Shader.LIGHT_POS_UNIFORM, this.position);
        shader.SetVec3Uniform(Shader.LIGHT_AMBIENT_UNIFORM, this.ambient);
        shader.SetVec3Uniform(Shader.LIGHT_DIFFUSE_UNIFORM, this.diffuse);
        shader.SetVec3Uniform(Shader.LIGHT_SPECULAR_UNIFORM, this.specular);
    }
}
