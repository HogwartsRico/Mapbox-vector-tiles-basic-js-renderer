uniform sampler2D u_texture;

#pragma mapbox: define lowp float opacity

varying vec2 v_tex;

void main() {
    #pragma mapbox: initialize lowp float opacity

    lowp float alpha = opacity;
    gl_FragColor = texture2D(u_texture, v_tex) * alpha;

#ifdef OVERDRAW_INSPECTOR
    gl_FragColor = vec4(1.0);
#endif
}
