package com.grandelite.payrollsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactAppController {
    @RequestMapping("/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/";
    }
}
