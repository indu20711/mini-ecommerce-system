package com.example.ecommerce.service;

import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        logger.debug("Registering user: {}", user.getEmail());
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        logger.debug("Attempting login for email: {}", email);
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            logger.info("Login successful for email: {}", email);
            return user;
        }
        logger.warn("Login failed for email: {}", email);
        return null;
    }
}
